const fs = require('fs');
const file = 'd:/ConnectSphere/ConnectSphere-Frontend/src/app/pages/search/search.component.ts';
let content = fs.readFileSync(file, 'utf8');

// 1. Move resets to the top of searchByTag and add searching=true/false
const newSearchByTag = `
  searchByTag(tag: string): void {
    const cleanTag = tag.replace(/^#/, '');
    this.searchQuery = '#' + cleanTag;
    this.viewingHashtag = cleanTag;
    this.searched = true;
    this.searching = true; // Show loading state
    this.activeTab = 'hashtags';
    this.saveRecentSearch(this.searchQuery.trim());

    // Reset results immediately
    this.hashtagPosts = [];
    this.postResults = [];
    this.hashtagReels = [];
    this.reelResults = [];
    this.hashtagResults = [];
    this.previewReel = null;

    // Load posts for this hashtag
    this.searchService.getPostsByHashtag(this.viewingHashtag).subscribe({
      next: (postIds) => {
        if (!postIds || postIds.length === 0) {
           this.searching = false;
           return;
        }
        let loadedCount = 0;
        postIds.forEach(id => {
          this.postService.getPostById(id).subscribe({
            next: (post) => {
              if (post.visibility === 'PUBLIC') {
                this.hashtagPosts.push(post);
                this.postResults.push(post);
              }
              loadedCount++;
              if (loadedCount === postIds.length) this.searching = false;
            },
            error: () => {
              loadedCount++;
              if (loadedCount === postIds.length) this.searching = false;
            }
          });
        });
      },
      error: () => {
        this.hashtagPosts = [];
        this.searching = false;
      }
    });

    // Also run normal hashtag entity search
    this.searchService.searchHashtags(this.viewingHashtag).subscribe({
      next: data => this.hashtagResults = data,
      error: () => this.hashtagResults = []
    });

    // Search reels locally - fuzzy match on caption
    this.reelService.getExploreReels().subscribe({
      next: data => {
        const tagLower = this.viewingHashtag.toLowerCase();
        // Match if caption contains the tag (with or without #)
        this.hashtagReels = data.filter(r => {
          if (!r.caption) return false;
          const captionLower = r.caption.toLowerCase();
          return captionLower.includes('#' + tagLower) || 
                 captionLower.includes(tagLower);
        });
        this.reelResults = this.hashtagReels;
      },
      error: () => { 
        this.hashtagReels = []; 
        this.reelResults = []; 
      }
    });
  }
`;

// Replace the old searchByTag function
const searchByTagRegex = /searchByTag\(tag: string\): void \{[\s\S]*?error: \(\) => \{ this\.hashtagReels = \[\]; this\.reelResults = \[\]; \}\r?\n\s*\}\);\r?\n\s*\}/;
content = content.replace(searchByTagRegex, newSearchByTag.trim());

fs.writeFileSync(file, content);
console.log('done');
