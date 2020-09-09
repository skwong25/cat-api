class BreedRepository {
    constructor() {
        this.breeds = [
            {
                breedId: 1,
                name: "tabby",
                description: "Tabbies have a distinctive 'M' shaped marking on their forehead, stripes by their eyes and across their cheeks, along their back, and around their legs and tail"
            },
            {
                breedId: 2,
                name: "turkish angora",
                description: "Turkish Angoras are one of the ancient, natural breeds of cat, having originated in central Turkey dated as far back as the 17th century, in the Ankara region."
            }
        ]
    }

    get getAllBreeds() {
        return this.breeds;
    }

    getBreedById (id) {
        const breedsCopy = this.getAllBreeds; 
        const idMatchArray = breedsCopy.filter((breed) => { 
            return breed['breedId'] == id; 
        })
        return idMatchArray[0];
    }
}

module.exports = new BreedRepository();

