"""
WHAT THIS FILE DOES (plain English):
Small helper for measuring the distance between two GPS points (latitude/
longitude pairs), used by the "nearest volunteer" and "nearby shelters"
spatial queries. This uses the Haversine formula -- plain Python math, no
database extension required.

MEMBER 4 HOOK: once PostGIS is enabled (see schema.sql), the queries that
use this function can be rewritten to use ST_DWithin / ST_Distance on a
geography(Point, 4326) column instead, which is faster at scale because
Postgres can use a spatial index rather than computing every distance in
Python. The API response shape (a `distance_km` field) is designed to stay
the same either way, so nothing on the frontend needs to change when that
swap happens.
"""

import math


EARTH_RADIUS_KM = 6371.0


def haversine_km(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    """
    Returns the great-circle distance between two lat/lng points, in
    kilometers. Accurate enough for "find the nearest volunteer/shelter"
    style ranking at city/district scale.
    """
    lat1_rad, lng1_rad, lat2_rad, lng2_rad = map(math.radians, (lat1, lng1, lat2, lng2))

    dlat = lat2_rad - lat1_rad
    dlng = lng2_rad - lng1_rad

    a = math.sin(dlat / 2) ** 2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlng / 2) ** 2
    c = 2 * math.asin(math.sqrt(a))

    return EARTH_RADIUS_KM * c
