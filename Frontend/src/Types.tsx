//Stack 
export type StackParamList = {
    Login: any;
    Register: any;
    Likes: { postId: string; };
    TabNav: any;
    PostDetails: {postId: string; userId: any; };
    Posts: { refresh?: boolean };
    AddPost: any;
    EditProfile: {
        userId: string;
        initialName: string;
        initialUsername: string;
        initialBio: string;
      };
    Connections: { userId: string; type: 'following' | 'followers' };
    Profile: {
        userId: string;
        name: string;
        username: string;
        profilephoto_url: string;
        bio: string;
        createdAt: string;
      };
      ExternalProfile: {
        userId: string;
        name: string;
        username: string;
        profilephoto_url: string;
        bio: string;
        createdAt: string;
      };
    }


//Tab
export type TabParamList = {
    Login: undefined;
    Home: any;
    Profile: {
        userId: string;
        name: string;
        username: string;
        profilephoto_url: string;
        bio: string;
        createdAt: string;
      };
    AddPost: any;
    Search: any;
    Notification: any;

}

