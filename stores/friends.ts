import { defineStore } from "pinia";

interface Friend {
  id: string;
  name: string;
  country: string;
  registration_date: string;
  profile_picture_url?: string;
}

interface Movie {
  id: number;
  titulo: string;
  posterUrl?: string;
  sinopsis?: string;
  duracionMinutos?: number;
  fechaEstreno?: string;
}

interface GroupRecommendation {
  movie: Movie;
  score: number;
}

type FriendsState = {
  friends: string[];
  selectedFriends: Friend[];
  groupRecommendations: GroupRecommendation[];
};

export const useFriendsStore = defineStore("friends", {
  state: (): FriendsState => ({
    friends: [],
    selectedFriends: [],
    groupRecommendations: [],
  }),
  actions: {
    async addFriend(friend: string) {
      this.friends.push(friend);
    },
    async removeFriend(friend: string) {
      for (const f of this.friends) {
        if (f === friend) {
          this.friends.splice(this.friends.indexOf(f), 1);
        }
      }
    },
    setSelectedFriends(friends: Friend[]) {
      this.selectedFriends = friends;
    },
    setGroupRecommendations(recommendations: GroupRecommendation[]) {
      this.groupRecommendations = recommendations;
    },
    clearGroupRecommendations() {
      this.groupRecommendations = [];
      this.selectedFriends = [];
    },
  },
});
