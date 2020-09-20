<script>
  import "chota";
  import { Input, Button, Container } from "svelte-chota";

  const defaultJson = `{ "name": "Piter Pupkin", "phone": "1234567" }`;
</script>

<style>
  /*main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}*/

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
        value={defaultJson} />
    </p>
    <Button type="submit" primary>Send data</Button>
  </form>
  </Container>
</main>
