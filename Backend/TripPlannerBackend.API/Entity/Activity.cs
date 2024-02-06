using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TripPlannerBackend.API.Entity
{
    public class Activity
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
        public string? Description { get; set; }
        public string Location { get; set; }
        public int TripId { get; set; }
        public Trip Trip { get; set; }
        public ActivityType ActivityType { get; set; }
        [ForeignKey("Cost")]
        public int? CostId { get; set; }
        public Cost? Cost { get; set; }
    }
}