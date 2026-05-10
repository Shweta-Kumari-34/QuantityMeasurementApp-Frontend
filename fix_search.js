const fs = require('fs');
const file = 'd:/ConnectSphere/ConnectSphere-Frontend/src/app/pages/search/search.component.ts';
let content = fs.readFileSync(file, 'utf8');

// Add hashtagReels and previewReel
content = content.replace(/hashtagPosts: Post\[\] = \[\];/, 'hashtagPosts: Post[] = [];\n  hashtagReels: Reel[] = [];\n  previewReel: Reel | null = null;');

// Add navigateToReels and openReelPreview
content = content.replace(/clearSearch\(\): void \{/, `openReelPreview(reel: Reel): void {
    this.previewReel = reel;
  }
  closeReelPreview(): void {
    this.previewReel = null;
  }
  navigateToReels(reelId: number): void {
    this.router.navigate(['/reels'], { queryParams: { reelId } });
  }
  
  clearSearch(): void {`);

// In clearSearch(), add hashtagReels and previewReel resets
content = content.replace(/hashtagPosts = \[\];/, 'hashtagPosts = [];\n    this.hashtagReels = [];\n    this.previewReel = null;');

// In search(), add check for hashtag
content = content.replace(/search\(\): void \{\r?\n\s*if \(\!this\.searchQuery\.trim\(\)\) return;\r?\n/, `search(): void {
    if (!this.searchQuery.trim()) return;
    if (this.searchQuery.trim().startsWith('#')) {
      this.searchByTag(this.searchQuery.trim().replace('#', ''));
      return;
    }
`);

// In searchByTag(), add reel search
content = content.replace(/this\.searchService\.searchHashtags\(tag\.replace\('#', ''\)\)\.subscribe\(\{[\s\S]*?error: \(\) => this\.hashtagResults = \[\]\r?\n\s*\}\);/, `this.searchService.searchHashtags(tag.replace('#', '')).subscribe({
      next: data => this.hashtagResults = data,
      error: () => this.hashtagResults = []
    });

    this.reelService.getExploreReels().subscribe({
      next: data => {
        const tagLower = this.viewingHashtag.toLowerCase();
        this.hashtagReels = data.filter(r => r.caption && r.caption.toLowerCase().includes('#' + tagLower));
      },
      error: () => this.hashtagReels = []
    });`);

fs.writeFileSync(file, content);
console.log('done');
