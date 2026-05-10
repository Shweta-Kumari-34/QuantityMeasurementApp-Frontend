const fs = require('fs');
const file = 'd:/ConnectSphere/ConnectSphere-Frontend/src/app/pages/dashboard/dashboard.component.ts';
let content = fs.readFileSync(file, 'utf8');

// 1. Update the subscription in ngOnInit to calculate profile completion
const newOnInitSubscription = `
    this.userProfileStateService.getCurrentUserProfile().subscribe({
      next: (profile) => {
        if (profile) {
          this.isVerified = !!profile.isVerified;
          this.profilePicUrl = profile.profilePicUrl || '';
          this.isPremiumMember = !!profile.isPremiumMember;
          this.username = profile.username || this.username;
          this.calculateProfileCompletion(profile);
        }
      },
      error: () => {
        this.isVerified = false;
        this.profileCompletion = 0;
      }
    });
`;

// 2. Add the calculateProfileCompletion method
const calculateMethod = `
  calculateProfileCompletion(profile: any): void {
    let score = 0;
    const totalSteps = 5;
    
    // Step 1: Basic Info (Email/Username - usually exist)
    if (profile.email || profile.username) score += 1;
    
    // Step 2: Full Name
    if (profile.fullName && profile.fullName.trim().length > 0) score += 1;
    
    // Step 3: Bio
    if (profile.bio && profile.bio.trim().length > 0) score += 1;
    
    // Step 4: Profile Picture
    if (profile.profilePicUrl && profile.profilePicUrl.trim().length > 0) score += 1;
    
    // Step 5: Social/Activity or Verification
    if (this.totalPosts > 0 || this.followerCount > 0 || profile.isVerified) score += 1;
    
    this.profileCompletion = Math.round((score / totalSteps) * 100);
  }
`;

// Replace the old subscription
const oldSubscriptionRegex = /this\.userProfileStateService\.getCurrentUserProfile\(\)\.subscribe\(\{[\s\S]*?error: \(\) => this\.isVerified = false\r?\n\s*\}\);/;
content = content.replace(oldSubscriptionRegex, newOnInitSubscription.trim());

// Insert the method before the end of the class
const classEndIndex = content.lastIndexOf('}');
content = content.slice(0, classEndIndex) + '\n' + calculateMethod.trim() + '\n' + content.slice(classEndIndex);

fs.writeFileSync(file, content);
console.log('done');
