const fs = require('fs');
const file = 'd:/ConnectSphere/ConnectSphere-Frontend/src/app/pages/search/search.component.ts';
let content = fs.readFileSync(file, 'utf8');

const updatedSearchByTag = `
  searchByTag(tag: string): void {
    const cleanTag = tag.trim().replace(/^#/, '');
    this.searchQuery = '#' + cleanTag;
    this.viewingHashtag = cleanTag;
    this.searched = true;
    this.searching = true;
    this.activeTab = 'hashtags';
    this.saveRecentSearch(this.searchQuery.trim());

    this.hashtagPosts = [];
    this.postResults = [];
    this.hashtagReels = [];
    this.reelResults = [];
    this.hashtagResults = [];
    this.previewReel = null;

    let postsFinished = false;
    let reelsFinished = false;

    const checkFinished = () => {
      if (postsFinished && reelsFinished) {
        this.searching = false;
      }
    };

    // Load posts for this hashtag
    this.searchService.getPostsByHashtag(this.viewingHashtag).subscribe({
      next: (postIds) => {
        if (!postIds || postIds.length === 0) {
          postsFinished = true;
          checkFinished();
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
              if (loadedCount === postIds.length) {
                postsFinished = true;
                checkFinished();
              }
            },
            error: () => {
              loadedCount++;
              if (loadedCount === postIds.length) {
                postsFinished = true;
                checkFinished();
              }
            }
          });
        });
      },
      error: () => {
        postsFinished = true;
        checkFinished();
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
        const q = this.viewingHashtag.toLowerCase().trim();
        this.hashtagReels = data.filter(r => {
          if (!r.caption) return false;
          const captionLower = r.caption.toLowerCase();
          // Extremely robust check: match #tag, tag, or tag with emojis attached
          return captionLower.includes('#' + q) || 
                 captionLower.includes(q) ||
                 (q.includes(' ') && captionLower.includes(q.replace(/\s+/g, '')));
        });
        this.reelResults = this.hashtagReels;
        reelsFinished = true;
        checkFinished();
      },
      error: () => { 
        this.hashtagReels = []; 
        this.reelResults = []; 
        reelsFinished = true;
        checkFinished();
      }
    });
  }
`;

// Replace searchByTag
const searchByTagRegex = /searchByTag\(tag: string\): void \{[\s\S]*?error: \(\) => \{ this\.hashtagReels = \[\]; this\.reelResults = \[\]; \}\r?\n\s*\}\);\r?\n\s*\}/;
content = content.replace(searchByTagRegex, updatedSearchByTag.trim());

// Also update search() to handle emojis in tags better
content = content.replace(/if \(this\.searchQuery\.trim\(\)\.startsWith\('#'\)\) \{/, "if (this.searchQuery.trim().startsWith('#') || this.searchQuery.trim().includes('#')) {");

fs.writeFileSync(file, content);
console.log('done');
