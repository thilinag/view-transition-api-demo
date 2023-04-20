import { FC } from "react";
import "./App.css";
import {
    QueryClient,
    QueryClientProvider,
    useQuery,
} from "@tanstack/react-query";
import {
    Link,
    RouterProvider,
    createBrowserRouter,
    useNavigate,
} from "react-router-dom";
import MovieDetails from "./MovieDetails";

export interface Movie {
    Title: string;
    Year: string;
    imdbID: string;
    Type: "movie | series | episode";
    Poster: string;
}

interface OMDBSearchResponse {
    Search: Movie[];
    Error?: string;
}

const queryClient = new QueryClient();

const Movies: FC = () => {
    const navigate = useNavigate();

    const { isLoading, error, data } = useQuery<OMDBSearchResponse>({
        queryKey: ["movies"],
        queryFn: async () => {
            const res = await fetch(
                `https://www.omdbapi.com/?apikey=${
                    import.meta.env.VITE_OMDB_API_KEY
                }&s=star+wars`
            );
            return res.json();
        },
    });

    if (isLoading) return <div>Loading...</div>;

    if (error) return <div>Woops</div>;

    if (!data) return <div>No results</div>;

    if (data.Error)
        return (
            <div>
                {data.Error}{" "}
                <a target="_blank" href="https://www.omdbapi.com/apikey.aspx">
                    Get OMDB API key
                </a>{" "}
                and run yarn dev.
            </div>
        );

    return (
        <div>
            <ul className="movies">
                {data.Search.map((movie) => (
                    <li key={movie.imdbID} className="movie">
                        <Link
                            to={`/movie/${movie.imdbID}`}
                            onClick={(ev) => {
                                ev.preventDefault();
                                // @ts-ignore startViewTransition not added yet
                                document.startViewTransition(() => {
                                    navigate(`/movie/${movie.imdbID}`);
                                });
                            }}
                            style={{
                                viewTransitionName: movie.imdbID,
                            }}
                        >
                            <img className="poster" src={movie.Poster} alt="" />
                            <h2>{movie.Title}</h2>
                            <small>{movie.Year}</small>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const router = createBrowserRouter([
    {
        index: true,
        element: <Movies />,
    },
    {
        path: "/movie/:imdbID",
        element: <MovieDetails />,
    },
]);

const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
        </QueryClientProvider>
    );
};

export default App;
