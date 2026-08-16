// Turns raw volunteer/shelter rows from the backend into the shapes the
// dashboards and the shared LiveMap render. Kept here (rather than inside a
// single dashboard) so the admin and volunteer views can't drift into
// showing the same record two different ways.

export function transformVolunteer(volunteer, sosRequests = []) {
  const activeMission = sosRequests.find(
    (sos) => sos.assignedVolunteerId === volunteer.user_id
  );

  return {
    name: volunteer.full_name,

    lat: volunteer.current_lat,
    lng: volunteer.current_lng,

    location:
      volunteer.current_lat != null && volunteer.current_lng != null
        ? `${volunteer.current_lat.toFixed(3)}, ${volunteer.current_lng.toFixed(3)}`
        : "Unknown",

    status: volunteer.is_available ? "Available" : "On Mission",
    task: activeMission ? activeMission.id : "None",
    phone: volunteer.phone,
  };
}

export function transformShelter(shelter) {
  const percentage = Math.round(
    (shelter.capacity_occupied / shelter.capacity_total) * 100
  );

  return {
    name: shelter.name,

    lat: shelter.location_lat,
    lng: shelter.location_lng,

    location:
      shelter.address ||
      `${shelter.location_lat.toFixed(3)}, ${shelter.location_lng.toFixed(3)}`,

    capacity: shelter.capacity_total,
    occupied: shelter.capacity_occupied,

    status: !shelter.is_active
      ? "Closed"
      : percentage >= 85
        ? "Near Capacity"
        : "Operational",
  };
}
