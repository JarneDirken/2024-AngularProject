using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using AutoMapper.Configuration.Annotations;

namespace TripPlannerBackend.API.Entity
{
    public class Cost
    {
        public int Id { get; set; }
        public double Amount { get; set; }
        public Currency Currency { get; set; }
        [Ignore]
        public Trip? Trip { get; set; } = null!;
        [Ignore]
        public Activity? Activity { get; set; } = null!;
    }
}
