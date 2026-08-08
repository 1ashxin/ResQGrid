"""
WHAT THIS FILE DOES (plain English):
This file holds our security tools:
1. Password hashing (bcrypt) - for volunteer/admin/NGO login accounts.
2. Fernet encryption - for scrambling sensitive victim details (name, phone,
   description) before they are saved to the database, so that even if
   someone steals the database, they can't read victims' personal
   information without our secret key.
3. A custom database column type (EncryptedString) that makes step 2
   automatic, so the rest of the codebase never has to remember to call
   encrypt/decrypt by hand.

Beginner analogies:
- Password hashing is like a paper shredder: you can shred a password into
  hashed form, but you can never "unshred" it back to the original. To check
  a login, we shred the typed password again and see if the shreds match.
- Fernet encryption is more like a locked box: we can lock (encrypt) and
  unlock (decrypt) data as long as we have the one secret key. Unlike
  hashing, we need the original text back later -- volunteers/admins need
  to actually read a victim's name and phone number to help them.
"""

import os
from cryptography.fernet import Fernet
from passlib.context import CryptContext
from sqlalchemy.types import TypeDecorator, String
from dotenv import load_dotenv

load_dotenv()

# ---------- Password hashing (bcrypt) ----------

# CryptContext is a passlib helper that manages hashing algorithms for us.
# We tell it to use "bcrypt", a well-tested algorithm designed to be slow on
# purpose (so attackers can't guess millions of passwords per second).
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(plain_password: str) -> str:
    """Turn a plain-text password into a scrambled bcrypt hash for safe storage."""
    return pwd_context.hash(plain_password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Check whether a typed-in password matches the stored hash, without
    ever needing to know (or store) the original password."""
    return pwd_context.verify(plain_password, hashed_password)


# ---------- Fernet field encryption ----------

FERNET_KEY = os.getenv("FERNET_KEY")

if not FERNET_KEY:
    raise RuntimeError(
        "FERNET_KEY is missing from your .env file. Generate one with:\n"
        "python -c \"from cryptography.fernet import Fernet; "
        "print(Fernet.generate_key().decode())\""
    )

# Fernet is a "recipe" from the cryptography library that both encrypts data
# AND verifies it hasn't been tampered with. We only need one instance,
# reused everywhere in the app.
fernet = Fernet(FERNET_KEY.encode())


def encrypt_value(plain_text):
    """Lock (encrypt) a piece of text before saving it to the database."""
    if plain_text is None:
        return None
    return fernet.encrypt(plain_text.encode()).decode()


def decrypt_value(encrypted_text):
    """Unlock (decrypt) a piece of text after reading it from the database."""
    if encrypted_text is None:
        return None
    return fernet.decrypt(encrypted_text.encode()).decode()


class EncryptedString(TypeDecorator):
    """
    A custom database column type that automatically encrypts data on the
    way IN to the database, and decrypts it on the way OUT -- so the rest of
    our code (models.py, routers) can just treat it like a normal text
    field, without remembering to call encrypt_value()/decrypt_value() every
    single time.

    Analogy: think of this as a "smart drawer". You put a normal sticky note
    in, and the drawer secretly locks it in a little safe. When you open the
    drawer again later, it automatically unlocks the note back to normal
    text for you.
    """

    impl = String
    cache_ok = True

    def process_bind_param(self, value, dialect):
        # Runs right before Python saves the value into PostgreSQL.
        return encrypt_value(value)

    def process_result_value(self, value, dialect):
        # Runs right after Python reads the value back out of PostgreSQL.
        return decrypt_value(value)
