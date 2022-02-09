using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class UpdateAttendance
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly IUserAccessor _userAccessor;
            private readonly DataContext _context;
            public Handler(IUserAccessor userAccessor, DataContext context)
            {
                _context = context;
                _userAccessor = userAccessor;
            }

            public async Task<Result<Unit>> Handle(Command request,
                CancellationToken cancellationToken)
            {
                var username = _userAccessor.GetUsername();
                var user = await _context.Users.FirstOrDefaultAsync(x =>
                    x.UserName == username);

                if (user == null) return null;

                var activity = await _context.Activities
                .Include(x => x.Attendees)
                .ThenInclude(x => x.AppUser)
                .FirstOrDefaultAsync(x => x.Id == request.Id);

                if (activity == null) return null;

                var hostName = activity.Attendees.FirstOrDefault(x => x.IsHost)?.AppUser?.UserName;
                var attendee = activity.Attendees.FirstOrDefault(x => x.AppUser.UserName == username);

                // If not host, add to attendees if not yet or remove from attendees if already in. 
                if (username != hostName)
                {
                    if (attendee == null)
                    {
                        activity.Attendees.Add(new ActivityAttendee
                        {
                            AppUser = user,
                            IsHost = false,
                            Activity = activity, 
                        });
                    }
                    else
                    {
                        activity.Attendees.Remove(attendee);
                    }
                }
                else
                {
                    activity.IsCancelled = !activity.IsCancelled;
                }

                var result = await _context.SaveChangesAsync() > 0;
                if (result) return Result<Unit>.Success(Unit.Value);
                return Result<Unit>.Failure("Unable to update attendee into database.");

            }
        }
    }
}