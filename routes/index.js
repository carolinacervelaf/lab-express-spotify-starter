const router = require("express").Router();
const { spotifyApi, configSpotify } = require("../config/spotify-config");
configSoptify()
  .then((data) => {
    console.log("Spotify API authenticated!", data);
  })
  .catch((err) => console.error(err));

router.get("/", (req, res) => res.render("home"));

router.get("/artist-search", (req, res) => {
  spotifyApi
    .searchArtists(req.query.artistSearch)
    .then((artistsResult) => {
      console.log("Artist search result =>", artistsResult.body.artists.items);
      res.render("searchResult", { artists: artistsResult.body.artists.items });
    })
    .catch((err) => console.error(err));
});

router.get("/albums/:artistId", async (req, res, next) => {
  try {
    const result = await spotifyApi.getArtistAlbums(req.params.id);

    res.render("albums", { albums: result.body.items });

    console.log(result.body.items);
  } catch (err) {
    console.error(err);
  }
});

router.get("/tracks/:albumId", (req, res) => {
  spotifyApi
    .getAlbumTracks(req.params.albumId)
    .then((result) => {
      console.log(result.body.items);
      res.render("tracks", {
        tracks: result.body.items.sort(
          (a, b) => a.track_number - b.track_number
        ),
      });
    })
    .catch((err) => console.error(err));
});

module.exports = router;
