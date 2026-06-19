using Microsoft.EntityFrameworkCore;

public class Film_MVCContext(DbContextOptions<Film_MVCContext> options) : DbContext(options)
{
    public DbSet<MvcMovie.Models.Movie> Movie { get; set; } = default!;
}
