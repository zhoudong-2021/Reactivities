using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.photos
{
    public class Delete 
    {
         public class Command : IRequest<Result<Unit>>
        {
            public string  Id { get; set; }
        }

        public class handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IPhotoAccessor _photoAccessor;
            private readonly IUserAccessor _userAccessor;
            public handler(DataContext context, IPhotoAccessor photoAccessor,
            IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _context = context;
                _photoAccessor = photoAccessor;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.Include(x => x.Photos)
                            .FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUsername());
                if (user == null) return null;

                var photo = user.Photos.FirstOrDefault(x => x.Id == request.Id);
                if(photo == null) return null;

                if(photo.IsMain) return Result<Unit>.Failure("You can not delete the main photo!");

                var removePhotoResult = await _photoAccessor.DeletePhoto(request.Id);
                if(removePhotoResult == null) return Result<Unit>.Failure("Unable to delete photo!");

                _context.Photos.Remove(photo);
                var result = await _context.SaveChangesAsync() > 0;

                if(result) return Result<Unit>.Success(Unit.Value);
                return Result<Unit>.Failure("Unable to delete photo!");
            }
        }
    }
    
}