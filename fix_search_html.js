const fs = require('fs');
const file = 'd:/ConnectSphere/ConnectSphere-Frontend/src/app/pages/search/search.component.html';
let content = fs.readFileSync(file, 'utf8');

// 1. Add Reels to "All" tab view
const allTabReelsStr = `
    <!-- Top Reels -->
    <div class="section-header" *ngIf="reelResults.length > 0">
      <h3>Reels</h3>
      <button class="view-more-btn" (click)="activeTab = 'reels'">See all</button>
    </div>
    <div class="post-results-grid" *ngIf="reelResults.length > 0">
      <div class="post-grid-item" *ngFor="let r of reelResults.slice(0, 3)" (click)="openReelPreview(r)">
        <div class="post-grid-thumb">
          <video *ngIf="r.mediaUrl" [src]="r.mediaUrl + '#t=0.1'" class="discovery-img"></video>
        </div>
        <div class="post-grid-overlay">
          <span>❤️ {{ r.likesCount || 0 }}</span>
        </div>
      </div>
    </div>
`;
// Insert before "Top Tags" in "All" view
content = content.replace(/<!-- Top Tags -->/, allTabReelsStr + '\n    <!-- Top Tags -->');

// 2. Add hashtagReels to Hashtag Detail view
const hashtagReelsStr = `
      <h3 *ngIf="hashtagReels.length > 0" style="margin-top:24px; font-size:18px; font-weight:700;">Reels for #{{ viewingHashtag }}</h3>
      <div class="post-results-grid" *ngIf="hashtagReels.length > 0" style="margin-top:12px;">
        <div class="post-grid-item" *ngFor="let r of hashtagReels" (click)="openReelPreview(r)">
          <div class="post-grid-thumb">
            <video *ngIf="r.mediaUrl" [src]="r.mediaUrl + '#t=0.1'" class="discovery-img"></video>
          </div>
          <div class="post-grid-overlay">
            <span>❤️ {{ r.likesCount || 0 }}</span>
            <span>👁️ {{ r.viewsCount || 0 }}</span>
          </div>
        </div>
      </div>
`;
// Insert after <div class="hashtag-posts-grid">...</div>
content = content.replace(/<\/div>\r?\n\s*<div class="empty-state" \*ngIf="hashtagPosts\.length === 0">/g, `</div>` + hashtagReelsStr + `\n      <div class="empty-state" *ngIf="hashtagPosts.length === 0 && hashtagReels.length === 0">`);


// 3. Add Reel Preview Modal at the very end
const modalStr = `
  <!-- Reel Preview Modal -->
  <div class="reel-modal-overlay" *ngIf="previewReel" (click)="closeReelPreview()">
    <div class="reel-modal-content" (click)="$event.stopPropagation()">
      <button class="reel-modal-close" (click)="closeReelPreview()">&times;</button>
      <video [src]="previewReel.mediaUrl" autoplay controls loop class="reel-modal-video"></video>
      <div class="reel-modal-info">
        <div class="reel-modal-author">@{{ previewReel.userEmail.split('@')[0] }}</div>
        <p class="reel-modal-caption">{{ previewReel.caption }}</p>
        <div class="reel-modal-stats">
          <span>❤️ {{ previewReel.likesCount || 0 }}</span>
          <span>👁️ {{ previewReel.viewsCount || 0 }}</span>
        </div>
        <div class="reel-modal-cta" *ngIf="!authService.isLoggedIn()">
           <button class="btn-primary" (click)="goToLogin()">Log in to interact</button>
        </div>
        <div class="reel-modal-cta" *ngIf="authService.isLoggedIn()">
           <button class="btn-primary" (click)="navigateToReels(previewReel.id)">Watch in Reels</button>
        </div>
      </div>
    </div>
  </div>
</div>`;
content = content.replace(/<\/div>\s*$/g, modalStr);


// 4. Update the reels tab item click action to open preview instead of navigateToProfile
content = content.replace(/<div class="post-grid-item" \*ngFor="let r of reelResults" \(click\)="navigateToProfile\(r\.userEmail\)">/g, `<div class="post-grid-item" *ngFor="let r of reelResults" (click)="openReelPreview(r)">`);


fs.writeFileSync(file, content);
console.log('done');
