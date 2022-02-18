using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : IdentityDbContext<AppUser>
    {
        public DataContext( DbContextOptions options) : base(options)
        {
        }

        public DbSet<Activity> Activities { get; set; }
        public DbSet<ActivityAttendee> ActivityAttendees { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<UserFollowing> UserFollowings { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<ActivityAttendee>(x => x.HasKey(aa => 
                new {aa.ActivityId, aa.AppUserId}));
            
            builder.Entity<ActivityAttendee>()
            .HasOne(u => u.AppUser)
            .WithMany(a => a.Activities)
            .HasForeignKey(u => u.AppUserId);

            builder.Entity<ActivityAttendee>()
            .HasOne(a => a.Activity)
            .WithMany(u => u.Attendees)
            .HasForeignKey(a => a.ActivityId);

            builder.Entity<Comment>()
            .HasOne(a => a.Activity)
            .WithMany(c => c.Comments)
            .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<UserFollowing>(b =>
            {
                b.HasKey(k => new {k.ObserverId, k.TargetId});

                b.HasOne(o => o.Observer)
                    .WithMany(f => f.Followings)
                    .HasForeignKey(k => k.ObserverId)
                    .OnDelete(DeleteBehavior.Cascade);
                
                b.HasOne(t => t.Target)
                    .WithMany(f => f.Followers)
                    .HasForeignKey(k => k.TargetId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

        }
    }
}