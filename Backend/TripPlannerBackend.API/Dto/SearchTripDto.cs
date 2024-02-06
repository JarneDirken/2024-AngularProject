using TripPlannerBackend.API.Entity;

namespace TripPlannerBackend.API.Dto
{
    public class SearchTripDto
    {
        public string? Name { get; set; }
        public string? Location { get; set; }
        public TripType? Type { get; set; }
    }
}