function getRepositories() {

    const userName = $('#js-username').val();
    const url = "http://api.github.com/users/"+userName+"/repos";

    fetch(url)
    .then(response => response.json())
    .then(responseJson => displayResults(responseJson)
    );
}

function displayResults(responseJson) {
    $('#results-list').empty();
    for (i=0; i<responseJson.length; i++) {
        $('#results-list').append(
            `<li>"${responseJson[i].name}"
            <p><a href="${responseJson[i].html_url}">Go to Repo</a></p>
            </li>`
          )};
    $('#results').removeClass('hidden');
    console.log(responseJson);
}

function handleSubmit() {
    $('.submit').on('click', function(event) {
        event.preventDefault();
        getRepositories();
    });
}


handleSubmit();