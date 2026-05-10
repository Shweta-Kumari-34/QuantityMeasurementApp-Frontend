const fs = require('fs');
const file = 'd:/ConnectSphere/ConnectSphere-Frontend/src/app/pages/explore/explore.component.ts';
let content = fs.readFileSync(file, 'utf8');

// Optimize loadPublicFeed: 
// 1. Remove redundant per-post API calls (counts are already in the post objects)
// 2. Use the dedicated /posts/feed endpoint which is better for discovery
// 3. Ensure loading is always reset
const optimizedLoadPublicFeed = `
  loadPublicFeed(): void {
    this.loading = true;
    this.postService.getFeed().subscribe({
      next: (posts) => {
        // Filter public posts and limit to 20 for instant display
        this.publicPosts = (posts || [])
          .filter(p => p.visibility === 'PUBLIC')
          .slice(0, 20);
        
        // NO EXTRA API CALLS NEEDED HERE - counts are now synced in the DB
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load public feed:', err);
        this.publicPosts = [];
        this.loading = false;
      }
    });
  }
`;

// Replace the old loadPublicFeed function
const oldLoadPublicFeedRegex = /loadPublicFeed\(\): void \{[\s\S]*?error: \(\) => \{ this\.publicPosts = \[\]; this\.loading = false; \}\r?\n\s*\}/;
content = content.replace(oldLoadPublicFeedRegex, optimizedLoadPublicFeed.trim());

fs.writeFileSync(file, content);
console.log('done');
