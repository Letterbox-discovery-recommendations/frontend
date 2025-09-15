import { defineStore } from "pinia";

export const useModalStore = defineStore("modal", {
  state: () => ({
    isOpen: false,
    selectedMovie: null,
  }),
  actions: {
    openModal(movie) {
      this.selectedMovie = movie;
      this.isOpen = true;
    },
    closeModal() {
      this.isOpen = false;
      this.selectedMovie = null;
    },
  },
  getters: {
    modalIsOpen: (state) => state.isOpen,
    currentMovie: (state) => state.selectedMovie,
  },
});
