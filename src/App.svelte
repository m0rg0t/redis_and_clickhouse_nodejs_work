<script>
  import "chota";
  import { Input, Button, Container } from "svelte-chota";

  let sendJson = `{ "name": "Piter Pupkin", "phone": "1234567" }`;
  let sendResponse = "";

  const sendJsonData = async data => {
    console.log("sendJson", sendJson);
    const url = "/v1/send";
    let response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8"
      },
      body: JSON.stringify({ data: sendJson })
    });
    let responseJson = await response.json();
    sendResponse = JSON.stringify(responseJson);
  };

  /**
   * Clear redis database from all keys
   **/
  const clearRedisDB = async () => {
    const url = "/v1/clearRedisDb";
    let response = await fetch(url, {
      method: "GET"
    });
    let responseJson = await response.json();
    if (responseJson) {
      return true;
    }
    return false;
  };
</script>

<style>
  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>

<main>
  <Container>
    <form method="POST" action="/v1/send">
      <p>
        <Input
          name="data"
          textarea
          placeholder="Input json data"
          bind:value={sendJson} />
      </p>
      <p>
        <Button
          type="submit"
          primary
          on:click={e => {
            sendJsonData(sendJson);
            e.preventDefault();
          }}>
          Send data
        </Button>
      </p>
    </form>
    <p>
      <label for="sendResponse">Response from server</label>
      <Input name="sendResponse" textarea value={sendResponse} />
    </p>

    <Button
      on:click={e => {
        clearRedisDB(sendJson);
        e.preventDefault();
      }}>
      Clear redis DB
    </Button>

  </Container>
</main>
