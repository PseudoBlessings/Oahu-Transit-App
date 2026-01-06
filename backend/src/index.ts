import express, {Express, Request, Response} from 'express'

const app:Express = express();

const PORT = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
    res.send('Your Oahu Transit API is running!');
});

app.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
});