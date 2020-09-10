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

    set setBreeds(breedsCopy) {
        this.breeds = breedsCopy;
    }

    findIndexById(id) {
        const breedsCopy = this.getAllBreeds; 
        const foundBreed = breedsCopy.findIndex((breed) => {
            return breed.breedId === id;       
        });
        return foundBreed;  // foundBreed is either -1 or a valid index
    }

    getBreedById (id) {
        const breedsCopy = this.getAllBreeds; 
        const idMatchArray = breedsCopy.filter((breed) => {  // could use findIndexById instead of array.filter
            return breed['breedId'] == id; 
        })
        return idMatchArray[0];
    }

    updateBreedById (id, object) {
        const breedsCopy = this.getAllBreeds; 
        const index = this.findIndexById(id); // 
        if (index === -1) {
            console.log(`index not present: ${index}`);
            return null;
        } else {
            for (let key in object) {
                if (breedsCopy[index][key] !== object[key]) {
                    breedsCopy[index][key] = object[key];
                    console.log(`Key '${key}' successfully updated`);
                }
            }
            this.setBreeds = breedsCopy; 
            return breedsCopy[index]; 
        };       
    }

    addBreed (newBreed) { 
        const breedsCopy = this.getAllBreeds;
        const newIndex = breedsCopy.length + 1
        newBreed.breedId = newIndex;
        breedsCopy.push(newBreed);
        this.setBreeds = breedsCopy; 
        return newBreed; 
    }

    deleteBreedById (id) {
        const breedsCopy = this.getAllBreeds;  // first, find the index. Then splice it by index. 
        if (foundBreed !== -1) {
            breedsCopy.splice(foundBreed, 1);
            this.setBreeds = breedsCopy; 
            return true;
        } else {
            return false;
        };
    }
}

module.exports = new BreedRepository();

