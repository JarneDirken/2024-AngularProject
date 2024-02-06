using TripPlannerBackend.API.Entity;

namespace TripPlannerBackend.API.Dto
{
    public class CreateCostDto
    {
        public double Amount { get; set; }
        public Currency Currency { get; set; }
    }
}
