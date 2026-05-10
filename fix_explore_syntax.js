const fs = require('fs');
const file = 'd:/ConnectSphere/ConnectSphere-Frontend/src/app/pages/explore/explore.component.ts';
let content = fs.readFileSync(file, 'utf8');

// The file was corrupted by a previous regex. I'll restore it and apply the fix cleanly.
// First, find the corrupted block and replace it with a clean one.

const cleanExploreClass = `export class ExploreComponent implements OnInit {

  private readonly API = '';

  publicPosts: any[] = [];
  trendingHashtags: any[] = [];
  searchQuery = '';
  searchResults: any[] = [];
  userResults: any[] = [];
  hashtagResults: any[] = [];
  searched = false;
  activeTab: 'posts' | 'users' | 'hashtags' = 'posts';
  loading = false;

  // Profile modal
  viewingUser: any = null;
  viewingUserPosts: any[] = [];

  // Suggested users
  suggestedUsers: ExploreUser[] = [];

  // Categories
  categories: ExploreCategory[] = [
    { label: 'Technology', icon: '💻', tag: 'tech', color: '#7c3aed' },
    { label: 'Travel', icon: '✈️', tag: 'travel', color: '#0891b2' },
    { label: 'Food', icon: '🍕', tag: 'food', color: '#ea580c' },
    { label: 'Fitness', icon: '💪', tag: 'fitness', color: '#16a34a' },
    { label: 'Education', icon: '📚', tag: 'education', color: '#2563eb' },
    { label: 'Art', icon: '🎨', tag: 'art', color: '#db2777' },
    { label: 'Music', icon: '🎵', tag: 'music', color: '#9333ea' },
    { label: 'Photography', icon: '📷', tag: 'photography', color: '#ca8a04' }
  ];

  constructor(
    private http: HttpClient,
    private router: Router,
    public authService: AuthService,
    private likeService: LikeService,
    private commentService: CommentService,
    private followService: FollowService,
    private postService: PostService
  ) {}

  ngOnInit(): void {
    this.loadPublicFeed();
    this.loadTrending();
    if (this.authService.isLoggedIn()) {
      this.loadSuggestedUsers();
    }
  }

  loadPublicFeed(): void {
    this.loading = true;
    // Call the correct feed endpoint and handle the loading state properly
    this.postService.getFeed().subscribe({
      next: (posts) => {
        this.publicPosts = (posts || [])
          .filter(p => p.visibility === 'PUBLIC')
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

  loadTrending(): void {
    this.http.get<any[]>(this.API + '/search/trending?limit=10').subscribe({
      next: (data) => this.trendingHashtags = data.map(t => ({
        tag: t.tag || t[0] || t,
        count: t.count || t[1] || 0
      })),
      error: () => this.trendingHashtags = []
    });
  }

  loadSuggestedUsers(): void {
    this.followService.getSuggestedUsers().subscribe({
      next: (emails) => {
        this.suggestedUsers = emails.slice(0, 6).map(e => ({
          email: e,
          username: e.split('@')[0],
          fullName: '',
          profilePicUrl: '',
          isVerified: false,
          isPremiumMember: false,
          isFollowing: false,
          followerCount: 0
        }));
        this.suggestedUsers.forEach(u => {
          this.http.get<any>(this.API + '/auth/user/' + u.email).subscribe({
            next: (profile) => {
              u.fullName = profile.fullName || '';
              u.profilePicUrl = profile.profilePicUrl || '';
              u.isVerified = !!profile.isVerified;
              u.isPremiumMember = !!profile.isPremiumMember;
            },
            error: () => {}
          });
          this.followService.isFollowing(u.email).subscribe({
            next: (val) => u.isFollowing = val,
            error: () => {}
          });
        });
      },
      error: () => this.suggestedUsers = []
    });
  }

  search(): void {
    if (!this.searchQuery.trim()) return;
    this.searched = true;

    this.http.get<any[]>(this.API + '/posts/search?q=' + this.searchQuery).subscribe({
      next: (posts) => this.searchResults = posts.filter(p => p.visibility === 'PUBLIC'),
      error: () => this.searchResults = []
    });

    this.http.get<string[]>(this.API + '/search/users?q=' + this.searchQuery).subscribe({
      next: (emails) => {
        this.userResults = emails.map(e => ({
          email: e,
          username: e.split('@')[0]
        }));
      },
      error: () => this.userResults = []
    });

    this.http.get<any[]>(this.API + '/auth/search?q=' + this.searchQuery).subscribe({
      next: (results) => {
        results.forEach(r => {
          if (!this.userResults.find((u: any) => u.email === r.email)) {
            this.userResults.push({
              email: r.email,
              username: r.username || r.email.split('@')[0],
              fullName: r.fullName || ''
            });
          }
        });
      },
      error: () => {}
    });

    this.http.get<any[]>(this.API + '/search/hashtags?q=' + this.searchQuery).subscribe({
      next: (data) => this.hashtagResults = data,
      error: () => this.hashtagResults = []
    });
  }

  searchByTag(tag: string): void {
    this.searchQuery = '#' + tag.replace('#', '');
    this.router.navigate(['/search'], { queryParams: { q: this.searchQuery } });
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.searched = false;
    this.searchResults = [];
    this.userResults = [];
    this.hashtagResults = [];
  }

  viewProfile(user: any): void {
    this.router.navigate(['/user', user.email]);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  goToSearch(): void {
    this.router.navigate(['/search']);
  }

  toggleFollow(user: ExploreUser): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    if (user.isFollowing) {
      this.followService.unfollow(user.email).subscribe({
        next: () => { user.isFollowing = false; },
        error: () => {}
      });
    } else {
      this.followService.follow(user.email).subscribe({
        next: () => { user.isFollowing = true; },
        error: () => {}
      });
    }
  }

  isMe(email: string): boolean {
    return email === (this.authService.getEmail() || '');
  }

  getTimeAgo(dateStr: string): string {
    if (!dateStr) return '';
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
    if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
    return Math.floor(diff / 86400) + 'd ago';
  }

  likePost(post: any): void {
    this.likeService.likeTarget(post.id, 'POST').subscribe({
      next: () => post.likeCount++
    });
  }

  commentPost(post: any): void {
    this.router.navigate(['/feed'], { queryParams: { postId: post.id } });
  }

  getInitial(name: string): string {
    return (name || 'U').charAt(0).toUpperCase();
  }
}
`;

const classRegex = /export class ExploreComponent[\s\S]*$/;
content = content.replace(classRegex, cleanExploreClass.trim());

fs.writeFileSync(file, content);
console.log('done');
