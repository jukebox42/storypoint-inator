# TODO

## Routes

```
- /
  - /session
    - [id]
    - /join
    - /host
```

## /

### Create

Fields:
- None

Clicking generates a hash and redirects them to the page

### Join

Fields:
- Hash
- Name
- isObserver

Clicking join prompts them to tell us what room they are joining.


### /session/join?id=XXXX

Fields:
- Hash (disabled if they passed a join id)
- Name
- isObserver

If they didn't provide an id then prompt them for it

Gotta check if the session is active after they hit submit. Don't do it before.

### /session/\[id]/host

Controls:
- Close Session - destroys the session
- End Voting - Locks voting for everyone. reveals votes.
- New Voting - Clears all votes. hides voting
- Maybe some way to set a timer? Later
- Maybe some way to nudge a person to provide their vote? Later

Need a way to do a still awake check. if it doesn't get a reply remove the user from the list. Maybe try twice?

### /session/\[id]

Controls:
- The way to vote. Can only pick one. Unless locked

## Data

### Player List

- List of players and their votes
- Hidden votes by default
- revealed at the same time

Separate list for observers?

### User

```json
{
  id: string,
  name: string,
  vote: string
  isObserver: boolean
}
```

### Users

```json
[
  User,
  ...
]
```

## Actions

### Request: Still There Check

An action sent from the host to users. Expects a reply. If it doesn't get one then the user left so remove them.

```json
{
  action: "check",
}
```

### Response: Still There Reply

A reply to the check command from a user to the host.

```json
{
  action: "here",
}
```

### Request: Join

An action sent to the host to join the session. See `joined` action for response.

```json
{
  action: "join",
  data: {
    name: string, // user's name
    isObserver: boolean, // if they an observer
  }
}
```

### Response: Joined

A response from the host when a user joins. contains their unique identifier they use for anything else.

```json
{
  action: "joined",
  data: {
    id: string, // this user's unique id
  }
}
```

### Action: Users

An action sent from the host to users including the list of users. Triggered when a player joins or leaves.

```json
{
  action: "users",
  data: [
    {
      id: string,
      name: string,
      isObserver: boolean,
    },
    // ...
  ]
}
```

### Request: Vote

An action sent from users to the host. Supports sending a blank vote (`""`) to clear out their answer.

```json
{
  action: "vote"
  data: {
    id: string // user id
    vote: string
  }
}
```

### Response: Voted

Response from the host confirming the vote was recorded.

```json
{
  action: "voted"
}
```

### Action: Start Voting

Sent from the host to users. Zeros out their votes.

```json
{
  action: "start",
}
```

### Stop Voting

Sent from the host to users. Locks the ability to vote and sends all users the vote values.

```json
{
  action: "stop",
  data: [
    {
      id: string, // player id
      vote: string,
    }
  ]
}
```

### End Session

Sent from the host. Closes the active session and kicks users back to the home screen.

```json
{
  action: "end",
}