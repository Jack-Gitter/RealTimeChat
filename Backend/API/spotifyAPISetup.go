package api

import (
	b64 "encoding/base64"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"strings"
)

type AuthInformation struct {
	Access_Token string
	Token_type   string
	Expires_in   int
}

type SongResponse struct {
	Tracks interface{}
}

func (a *AuthInformation) SetAuthInformation() {

	clientID := "59f4360e54334564923873224b4eae20"
	clientSecret := "2074e5c3e9ec4a3281446a8e49248d49"
	stringToEncode := "" + clientID + ":" + clientSecret
	stringToSet := b64.StdEncoding.EncodeToString([]byte(stringToEncode))

	client := http.Client{}
	form := url.Values{}

	form.Add("grant_type", "client_credentials")

	req, _ := http.NewRequest("POST", "https://accounts.spotify.com/api/token", strings.NewReader(form.Encode()))
	req.Header.Set("Authorization", "Basic "+stringToSet)
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	res, err := client.Do(req)

	if err != nil {
		fmt.Println(err)
	}

	json.NewDecoder(res.Body).Decode(&a)

	if err != nil {
		fmt.Println(err)
	}

	fmt.Println(a.Access_Token)
}

func (a *AuthInformation) GetNewSongs() {
	// within this method, we need to get the name of the track, and the uri so that we can play it!
	// we should also add all of these songs to some sort of object somewhere
	client := http.Client{}
	songResponse := SongResponse{}

	req, _ := http.NewRequest("GET", "https://api.spotify.com/v1/search?q=track%25100&type=track", nil)
	req.Header.Set("Authorization", "Bearer "+a.Access_Token)
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	resp, _ := client.Do(req)
	json.NewDecoder(resp.Body).Decode(&songResponse)
	fmt.Println(songResponse)
}
