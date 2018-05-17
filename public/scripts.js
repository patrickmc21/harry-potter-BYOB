$('#submit').on('click', getToken);

async function getToken(e) {
  e.preventDefault();
  const email = $('#email').val();
  const appName = $('#app-name').val();
  const token = await fetchToken(email, appName);
  $('#key-zone').val(token);
  $('#email').val('');
  $('#app-name').val('');
}

async function fetchToken(email, appName) {
  const url = '/authenticate';
  const options = {
    method: 'POST',
    body: JSON.stringify({email, appName}),
    headers: {
      'content-type': 'application/json'
    }
  };

  try {
    const response = await fetch(url, options);
    const body = await response.json();
    if (response.status === 200) {
      return body.token;
    } else {
      return body.message
    }
  } catch (err) {
    return err
  }
}