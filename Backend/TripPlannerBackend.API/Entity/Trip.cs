using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Reflection.Metadata;
using System.Text;
using System.Threading.Tasks;

namespace TripPlannerBackend.API.Entity
{
    public class Trip
    {
        public int Id { get; set; }
        public TripType? Type { get; set; }
        public string Name { get; set; }
        public string Location { get; set; }
        public string Image { get; set; }
        public string? UserId { get; set; } = null;
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
        public ICollection<Activity> Activities { get; set; }
        public bool IsPublic { get; set; } = false;
        public ICollection<User>? Users { get; set; }
        [ForeignKey("Cost")]
        public int? CostId { get; set; }
        public Cost? Cost { get; set; }
        public int Count { get; set; }

    }
}