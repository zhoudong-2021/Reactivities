using System.Collections.Generic;
using Domain;

namespace Application.profiles
{
    public class Profile
    {
        public string Username { get; set; }
        public string DisplayName { get; set; }
        public string Bio { get; set; }
        public string Image { get; set; }
        public bool IsFollowing { get; set; }
        public int FollowingCount { get; set; }
        public int FollowerCount { get; set; }
        public ICollection<Photo> Photos { get; set; }
    }
}