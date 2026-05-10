const fs = require('fs');
const file = 'd:/ConnectSphere/ConnectSphere-Frontend/src/app/pages/explore/explore.component.ts';
let content = fs.readFileSync(file, 'utf8');

const improvedLoadPublicFeed = `
  loadPublicFeed(): void {
    this.loading = true;
    // Use /posts/all to ensure we get the same base data as the search page
    this.http.get<any[]>(this.API + '/posts/all').subscribe({
      next: (posts) => {
        // Robust case-insensitive visibility check
        this.publicPosts = (posts || [])
          .filter(p => {
            const vis = (p.visibility || '').toUpperCase();
            return vis === 'PUBLIC' || vis === 'ALL' || !p.visibility;
          })
          .slice(0, 20);
        
        this.loading = false;
      },
      error: (err) => {
        console.error('Explore feed error:', err);
        this.publicPosts = [];
        this.loading = false;
      }
    });
  }
`;

const oldLoadPublicFeedRegex = /loadPublicFeed\(\): void \{[\s\S]*?error: \(err\) => \{[\s\S]*?\}[\s\S]*?\}\);[\s\S]*?\}/;
content = content.replace(oldLoadPublicFeedRegex, improvedLoadPublicFeed.trim());

fs.writeFileSync(file, content);
console.log('done');
