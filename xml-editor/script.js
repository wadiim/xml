const fileSelector = document.getElementById("fileSelector");
const addAnimeButton = document.getElementById("addAnimeButton");
const save = document.getElementById("save");

let xmlDoc;
let xmlRoot;

let maxAnimeId = 0;

function read(blob) {
    let url = URL.createObjectURL(blob);
    let connect = new XMLHttpRequest();
    connect.open("GET", url, false);
    connect.setRequestHeader("Content-Type", "text/xml");
    connect.send(null);

    xmlDoc = connect.responseXML;
    xmlRoot = xmlDoc.getRootNode();
    let animeList = xmlRoot.getElementsByTagName("animeList")[0].getElementsByTagName("anime");

    for (let i = 0; i < animeList.length; ++i) {
        let anime = createAnime(
            animeList[i].getAttribute("animeId"),
            animeList[i].getElementsByTagName("title")[0],
            animeList[i].getElementsByTagName("rating")[0],
            animeList[i].getElementsByTagName("releaseDate")[0],
            (animeList[i].getElementsByTagName("numberOfEpisodes") === undefined) ? "" : animeList[i].getElementsByTagName("numberOfEpisodes")[0],
            animeList[i].getElementsByTagName("description")[0],
            animeList[i].getElementsByTagName("img")[0],
            animeList[i].getElementsByTagName("creatorList")[0].getElementsByTagName("creator"),
            animeList[i].getElementsByTagName("genreList")[0].getElementsByTagName("genre"),
            animeList[i]
        );
        document.getElementById("animeList").insertBefore(anime, addAnimeButton);
    }

    document.getElementById("animeList").style.display = "block";
    save.style.display = "flex";
}

function write() {
    const serializer = new XMLSerializer();
    let toSave = serializer.serializeToString(xmlDoc);

    const newBlob = new Blob([toSave], { type: "text/xml" });
    const url = URL.createObjectURL(newBlob);

    const fakeLink = document.createElement("a");
    fakeLink.href = url;
    fakeLink.download = "changed.xml";
    fakeLink.click();
}

function createAnime(id, title, rating, releaseDate, numberOfEpisodes, description, image, creatorList, genreList, animeXML) {
    let anime = document.getElementById("animeForm").cloneNode(true);

    let idNum = id.match(/\d+/)[0];
    if (idNum > maxAnimeId) {
        maxAnimeId = idNum;
    }

    let idInput = anime.querySelector("#animeId");
    let titleInput = anime.querySelector("#title");
    let ratingInput = anime.querySelector("#rating");
    let releaseDateInput = anime.querySelector("#releaseDate");
    let numberOfEpisodesInput = anime.querySelector("#numberOfEpisodes");
    let descriptionInput = anime.querySelector("#description");
    let imageInput = anime.querySelector("#image");

    idInput.value = id;
    titleInput.value = (title === undefined) ? "" : title.innerHTML;
    ratingInput.value = (rating === undefined) ? "" : rating.innerHTML;
    releaseDateInput.value = (releaseDate === undefined) ? "" : releaseDate.innerHTML;
    numberOfEpisodesInput.value = (numberOfEpisodes === undefined) ? "" : numberOfEpisodes.innerHTML;
    descriptionInput.value = (description === undefined) ? "" : description.innerHTML;
    imageInput.value = (image === undefined) ? "" : image.getAttribute("src");

    titleInput.addEventListener("change", () => {
        title.innerHTML = titleInput.value;
    });
    ratingInput.addEventListener("change", () => {
        rating.innerHTML = ratingInput.value;
        if (ratingInput.validity.typeMismatch) {
            ratingInput.setCustomValidity("I am expecting a floating-point number!");
            ratingInput.reportValidity();
        } else {
            ratingInput.setCustomValidity("");
        }
    });
    releaseDateInput.addEventListener("change", () => {
        releaseDate.innerHTML = releaseDateInput.value;
    });
    numberOfEpisodesInput.addEventListener("change", () => {
        if (numberOfEpisodes === undefined) {
            let numberOfEpisodesXML = xmlDoc.createElement("numberOfEpisodes");
            numberOfEpisodesXML.innerHTML = numberOfEpisodesInput.value;
            let descriptionXML = animeXML.getElementsByTagName("description")[0];
            animeXML.insertBefore(numberOfEpisodesXML, descriptionXML);
        } else {
            numberOfEpisodes.innerHTML = numberOfEpisodesInput.value;
        }
    });
    descriptionInput.addEventListener("change", () => {
        description.innerHTML = descriptionInput.value;
    });
    imageInput.addEventListener("change", () => {
        image.setAttribute("src", imageInput.value);
    });

    /* Add creators */
    for (let j = 0; j < ((creatorList === undefined) ? 0 : creatorList.length); ++j) {
        if (creatorList[j] === undefined) continue;
        let creator = createCreator(creatorList[j], anime, animeXML);
        anime.querySelector("#creatorList").appendChild(creator);
    }

    /* Add creator add button */
    let creatorAddButton = document.createElement("button");
    creatorAddButton.setAttribute("type", "button");
    creatorAddButton.innerHTML = "Add Creator";
    creatorAddButton.addEventListener("click", () => {
        let creatorXML = xmlDoc.createElement("creator");
        creatorXML.setAttribute("directorId", "");
        let creator = createCreator(creatorXML, anime, animeXML);
        anime.querySelector("#creatorList").insertBefore(creator, creatorAddButton);

        /* Insert the new creator to XML */
        animeXML.getElementsByTagName("creatorList")[0].appendChild(creatorXML);
    });
    anime.querySelector("#creatorList").appendChild(creatorAddButton);

    /* Add genres */
    for (let j = 0; j < ((genreList === undefined) ? 0 : genreList.length); ++j) {
        if (genreList[j] === undefined) continue;
        let genre = createGenre(genreList[j], anime, animeXML);
        anime.querySelector("#genreList").appendChild(genre);
    }

    /* Add genre add button */
    let genreAddButton = document.createElement("button");
    genreAddButton.setAttribute("type", "button");
    genreAddButton.innerHTML = "Add Genre";
    genreAddButton.addEventListener("click", () => {
        let genreXML = xmlDoc.createElement("genre");
        genreXML.setAttribute("genreId", "");
        let genre = createGenre(genreXML, anime, animeXML);
        anime.querySelector("#genreList").insertBefore(genre, genreAddButton);

        /* Insert the new genre to XML */
        animeXML.getElementsByTagName("genreList")[0].appendChild(genreXML);
    });
    anime.querySelector("#genreList").appendChild(genreAddButton);

    /* Add anime delete button */
    let deleteAnimeButton = anime.getElementsByClassName("deleteAnimeButton")[0];
    deleteAnimeButton.addEventListener("click", () => {
        /* Remove the anime from HTML */
        document.getElementById("animeList").removeChild(anime);
        /* Remove the anime from XML */
        xmlDoc.getElementsByTagName("animeList")[0].removeChild(animeXML);
    });

    anime.style.display = "flex";

    return anime;
}

function createCreator(creatorXML, anime, animeXML) {
    let label = document.createElement("label");
    label.setAttribute("for", "creatorId");
    label.innerHTML = "Creator ID:";

    let input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("name", "creatorId");
    input.setAttribute("class", "creatorId");
    input.setAttribute("pattern", "D\\d+");
    input.value = (creatorXML === undefined) ? "" : creatorXML.getAttribute("directorId");
    input.addEventListener("change", () => {
        /* Update the creator's id in XML */
        creatorXML.setAttribute("directorId", input.value);
    });

    /* Add delete button */
    let deleteButton = document.createElement("button");
    deleteButton.setAttribute("type", "button");
    deleteButton.innerHTML = "Delete Creator";
    deleteButton.addEventListener("click", () => {
        /* Remove the creator from XML */
        animeXML.getElementsByTagName("creatorList")[0].removeChild(creatorXML);
        /* Remove the creator from HTML */
        anime.querySelector("#creatorList").removeChild(deleteButton.parentNode);
    });

    let creator = document.createElement("div");
    creator.appendChild(label);
    creator.appendChild(input);
    creator.appendChild(deleteButton);

    return creator;
}

function createGenre(genreXML, anime, animeXML) {
    let label = document.createElement("label");
    label.setAttribute("for", "genreId");
    label.innerHTML = "Genre ID:";

    let input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("name", "genreId");
    input.setAttribute("class", "genreId");
    input.value = (genreXML === undefined) ? "" : genreXML.getAttribute("genreId");
    input.addEventListener("change", () => {
        /* Update the genre's id in XML */
        genreXML.setAttribute("genreId", input.value);
    });

    /* Add delete button */
    let deleteButton = document.createElement("button");
    deleteButton.setAttribute("type", "button");
    deleteButton.innerHTML = "Delete Genre";
    deleteButton.addEventListener("click", () => {
        /* Remove the genre from HTML */
        animeXML.getElementsByTagName("genreList")[0].removeChild(genreXML);
        /* Remove the genre from XML */
        anime.querySelector("#genreList").removeChild(deleteButton.parentNode);
    });

    let genre = document.createElement("div");
    genre.appendChild(label);
    genre.appendChild(input);
    genre.appendChild(deleteButton);

    return genre;
}

fileSelector.addEventListener("change", () => {
    read(fileSelector.files[0]);
});

save.addEventListener("click", () => {
    write();
});

addAnimeButton.addEventListener("click", () => {
    maxAnimeId = Number(maxAnimeId) + 1;

    let animeXML = xmlDoc.createElement("anime");
    animeXML.setAttribute("animeId", "A" + maxAnimeId);
    animeXML.appendChild(xmlDoc.createElement("title"));
    animeXML.appendChild(xmlDoc.createElement("rating"));
    animeXML.appendChild(xmlDoc.createElement("releaseDate"));
    animeXML.appendChild(xmlDoc.createElement("numberOfEpisodes"));
    animeXML.appendChild(xmlDoc.createElement("description"));
    animeXML.appendChild(xmlDoc.createElement("img"));
    animeXML.appendChild(xmlDoc.createElement("creatorList"));
    animeXML.appendChild(xmlDoc.createElement("genreList"));

    let anime = createAnime(
        "A" + maxAnimeId,
        animeXML.getElementsByTagName("title")[0],
        animeXML.getElementsByTagName("rating")[0],
        animeXML.getElementsByTagName("releaseDate")[0],
        animeXML.getElementsByTagName("numberOfEpisodes")[0],
        animeXML.getElementsByTagName("description")[0],
        animeXML.getElementsByTagName("img")[0],
        animeXML.getElementsByTagName("creatorList")[0].getElementsByTagName("creator"),
        animeXML.getElementsByTagName("genreList")[0].getElementsByTagName("genre"),
        animeXML
    );
    document.getElementById("animeList").insertBefore(anime, addAnimeButton);

    /* Insert the new anime to XML */
    xmlDoc.getElementsByTagName("animeList")[0].appendChild(animeXML);
});