using TripPlannerBackend.API.Entity;

namespace TripPlannerBackend.API.Dto
{
    public class GetCostDto
    {
        public int Id { get; set; }
        public double Amount { get; set; }
        public Currency Currency { get; set; }
    }
}
