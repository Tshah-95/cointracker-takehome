This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

After cloning the respository, install packages in the root directory with `pnpm install`

The database should already be configured since I decided to check the sqlite db into version control.

To start fresh you could simply delete that file and run `sqlite3 prisma/cointracker.db` from the root directory and then `npx prisma db push`

You should be good to run the development server then with

```bash
pnpm run dev
# or
bun run dev
```

and this should open the project on [localhost:3000](http://localhost:3000/)

## Assumptions

I pretended this app was going to be an MVP for a wallet monitoring/alerts tool since it's largely buildable off of just a given user's transaction history. With that in mind:

1. I made the nav super lightweight since the app likely wouldn't scale past a few core functions so i went with tabs instead of a top/side nav.
2. I put a bit of impotus on some nice animations + transitions since the value prop is that this is supposed to feel better/simpler to use than other tools.
3. I tried to at least get the core ux/server/backfilling all actually functional with scalability compromises rather than build fewer systems out more thoroughly, so this could be actually demo'd
4. I wanted (but ran out of time) to make the backfill process optimistic and/or visible so that you could incrementally navigate the features as your data filled in without confusion. Empty states + toasts would also help here
5. I wanted better crud functionality around the addresses (like editable nicknames, shortcuts, etc) but settled for at least delete functionality that cascades to underlying models

## System Design

#### DB

I spun up a quick sqlite db and wrapped prisma around it for ease of configuration/type-safety oob.

#### Models

There are only 3 models right now - address, balance, transaction. Since only the final balance in satoshi is relevant for the assignment requirements, balance could have just existed on the address, but in a world where there are many tokens on many chains i could see splitting address -> balance being useful, so i split it into it's own model that's 1:1 for now. Address -> transaction is logically 1 to many and both models are set to cascade delete in the event a user deletes an address. This could potentially be amended to help with recovery by making the delete endpoint mark those entries as "deleted" instead so if a user goes to recover an address we don't need to re-backfill it.

#### API Structure

Right now the backend is some simple Next server functions. The address POST endpoint handles backfilling alongside the creation of the address right now (more on faults of this later). Could definitely see a strong argument for a persistent backend instead w/ bullmq for job management since the primary flow involves a rather heavy etl pipeline, and I actually opted for serverless only because i found trigger.dev yesterday which I think is a reasonable alternative for a small app that lets you still build/deploy very quickly on Vercel. Certainly enough to cover the use cases of an MVP

#### Frontend

Classic next/react frontend. I used shadcn and tailwind-motion to make building/animating components much faster and SWR for data fetching. I opted SWR over fetch mainly because I knew we'd need mutations to refresh the state of the "wallet" after you added a new address.

## Technical Shortcomings

Obviously within 4ish hours I couldn't get to a lot of the level of robustness I'd hope to achieve in a real system, so here are some immediate fires i'd put out

1. Validation - the address entry process doesn't check for really anything (except preventing empty strings) and will break if you put in an invalid address. We'd want to add some client + server side insurance to catch/fix that as early as possible. Ideally with regex against the form input to just detect if it's a valid bitcoin address. It also doesn't account for re-entry of the same address, which we'd want to prevent

2. Backfilling - Next server functions suck at running long jobs (courtesy of lambda) and the current architecture doesn't give the user the entity back until things are backfilled. We'd ideally offload the backfilling to something like trigger.dev (if we wanted to stay serverless) or to some other persistent backend where we could queue jobs w/ bullmq or SQS -> lambdas and close the loop via a websocket to update the UX or SNS for notifications to the user or w/e makes most product sense (ideally live and async notifications for when loading is done).

3. Request Rate Limiting - The backfill process also currently sends requests batched by 10,000 transactions ASAP, which will exceed the public rate limits pretty quickly. We'd either need to scale our plan to meet needs or throttle requests with bottleneck.js (additional note that we'd need to account for multiple workers potentially rate limiting in aggregate)

4. Paginate transaction retrieval - I set up the transactions table with tanstack/react-table (90% boilerplate so there's some extraneous stuff) to handle paginating on the frontend, but if there's 15 million transactions across 10 addresses, we'd still get ruined on our server trying to retreive them all and serialive -> send to frontend (and store on the frontend), so keyset paginating that request would probably be ideal since users are likely to start at 0 and scroll through.
   This could still get sketchy with sorting, so we might need to be smarter about limiting data pulled into that table

5. Users - There is no concept of a user right now... metamask oauth is probably most logical if we had to pick 1 auth method to start with since we'd get most people's addresses off the cuff (and maybe tx histories? haven't played with it before).

## Product Shortcomings

1. The UX is still pretty meh. I'm happy with the general layout/nav but it's not particularly responsive and center aligning all the addresses looks quite ugly to me and doesn't denote the importance of an address as a first order entity in the system. I'd probably make them cards that can be full screen width on mobile and have them open into a modal / their own screen to see/edit richer data. I'd like them to be groupable as well depending on how many addresses the average user has / some user research

2. We'd probably want to adopt addresses on other chains. This would require us to start building out conversions functionality a bit more intentionally so users can see things in USD instead of satoshi

3. If we could simplify the wallet management to just integrating with user's wallets without manual entry i also imagine that improves the onboarding funnel dramatically

4. Analytics/Alerts are probably more important for our target user than a richer transaction history experience (which we can just outsource in v1), so i'd love to build charts for portfolio value over time by address/wallet, comparisons of your wallet vs indicies, or maybe even correlations between big dips/climbs and news events. And then an alerting interface that lets you configure email/text thresholds for when your portfolio / holdings by coin change by some amount

Hope you enjoyed looking over my project :)
