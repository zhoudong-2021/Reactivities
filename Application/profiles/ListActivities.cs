using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.profiles
{
    public class ListActivities
    {
        public class Query : IRequest<Result<List<UserActivityDto>>>
        {
            public string Username { get; set; }
            public string Predicate { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<UserActivityDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<Result<List<UserActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var activities = await _context.ActivityAttendees
                    .Where(x => x.AppUser.UserName == request.Username)
                    .OrderBy(x => x.Activity.Date)
                    .ProjectTo<UserActivityDto>(_mapper.ConfigurationProvider)
                    .ToListAsync();

                switch (request.Predicate)
                {
                    case "past":
                        activities = activities.Where(x => x.Date <= DateTime.UtcNow).ToList();
                        break;
                    case "future":
                        activities = activities.Where(x => x.Date > DateTime.UtcNow).ToList();
                        break;
                    case "hosting":
                        activities = activities.Where(x => x.HostUsername == request.Username).ToList();
                        break;
                    default:
                        break;
                }


                return Result<List<UserActivityDto>>.Success(activities);



            }
        }
    }
}