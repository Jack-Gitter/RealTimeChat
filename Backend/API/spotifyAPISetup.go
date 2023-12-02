package api

import (
	b64 "encoding/base64"
	"fmt"
	"net/http"
	"net/url"
	"strings"
)

type AuthOptions struct {
	url     string
	headers map[string]string
	form    map[string]string
	json    bool
}

func GetAuthToken() {

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

	fmt.Println(res)

}
