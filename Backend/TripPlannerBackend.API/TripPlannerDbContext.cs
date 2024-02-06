using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using System.Reflection.Metadata;
using TripPlannerBackend.API.Entity;

namespace TripPlannerBackend.API
{
    public class TripPlannerDbContext : DbContext
    {
        public TripPlannerDbContext()
        {

        }

        public TripPlannerDbContext(DbContextOptions<TripPlannerDbContext> options) : base(options)
        {
        }
        public DbSet<Trip> Trips => Set<Trip>();
        public DbSet<Cost> Cost => Set<Cost>();
        public DbSet<Activity> Activities => Set<Activity>();
        public DbSet<ActivityType> ActivityType => Set<ActivityType>();
        public DbSet<UserTripCount> UserTripCount => Set<UserTripCount>();
        //public DbSet<Location> Locations => Set<Location>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Trip>()
                .HasMany(e => e.Activities)
                .WithOne(e => e.Trip)
                .HasForeignKey(e => e.TripId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Trip>()
                .HasOne(e => e.Cost)
                .WithOne(e => e.Trip)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Activity>()
                .HasOne(e => e.Cost)
                .WithOne(e => e.Activity)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Activity>()
                .HasOne(e => e.Trip)
                .WithMany(e => e.Activities)
                .HasForeignKey(e => e.TripId)
                .IsRequired();

            modelBuilder.Entity<Trip>()
                .HasMany(e => e.Users)
                .WithOne(e => e.Trip)
                .IsRequired();

            modelBuilder.Entity<User>()
                .HasOne(e => e.Trip)
                .WithMany(e => e.Users)
                .IsRequired();

            modelBuilder.Entity<ActivityType>()
                .HasMany(e => e.Activities)
                .WithOne(e => e.ActivityType)
                .IsRequired();

            modelBuilder.Entity<Activity>()
                .HasOne(e => e.ActivityType)
                .WithMany(e => e.Activities)
                .IsRequired();

            modelBuilder.Entity<Cost>()
                .HasOne(e => e.Trip)
                .WithOne(t => t.Cost)
                .HasForeignKey<Cost>("TripId")
                .OnDelete(DeleteBehavior.ClientCascade);

            modelBuilder.Entity<Cost>()
              .HasOne(e => e.Activity)
              .WithOne(t => t.Cost)
              .HasForeignKey<Cost>("ActivityId")
              .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Trip>().ToTable("Trip");
            modelBuilder.Entity<Activity>().ToTable("Activity");
            modelBuilder.Entity<User>().ToTable("User");
            modelBuilder.Entity<Cost>().ToTable("Cost");
            modelBuilder.Entity<ActivityType>().ToTable("ActivityType");
        }
    }
}