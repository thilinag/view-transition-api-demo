import { FC, useEffect, useState } from "react";
import "./App.css";
import { useQuery } from "@tanstack/react-query";
import { Movie } from "./App";
import { Link, useParams } from "react-router-dom";

interface MovieResponse extends Movie {
    Plot: "string";
    Actors: "string";
}

const MovieDetails: FC = () => {
    let { imdbID } = useParams();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const { isLoading, error, data, isFetching } = useQuery<MovieResponse>({
        queryKey: ["movieDetails"],
        queryFn: async () => {
            const res = await fetch(
                `http://www.omdbapi.com/?apikey=${
                    import.meta.env.VITE_OMDB_API_KEY
                }&i=${imdbID}`
            );
            return res.json();
        },
    });

    if (isFetching || isLoading)
        return (
            <div className="movie-details movie-details--placeholder">
                <img
                    className="poster poster--full poster--placeholder"
                    src=""
                    alt=""
                    style={{
                        viewTransitionName: imdbID,
                    }}
                />
                <section>
                    <h1>▆▆▆▆▆▆ ▆▆▆▆▆▆▆▆ ▆▆</h1>
                    <p>
                        ▆▆▆▆▆▆▆▆▆▆▆ ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ ▆▆▆▆▆▆▆▆▆▆▆ ▆▆▆▆▆▆▆▆▆▆
                        ▆▆▆▆▆▆
                    </p>
                    <p>▆▆▆▆▆▆▆▆▆▆▆ ▆▆▆▆▆▆▆▆▆▆▆ ▆▆▆▆▆▆▆▆▆▆▆</p>
                </section>
            </div>
        );

    if (!data) return <div>No results</div>;

    if (error) return <div>{`An error has occurred: ${error}`}</div>;

    return (
        <div className="movie-details">
            <img
                className="poster poster--full"
                src={data.Poster}
                alt=""
                style={{
                    viewTransitionName: data.imdbID,
                }}
            />
            <section>
                <h1>{data.Title}</h1>
                <p>{data.Plot}</p>
                <p>{data.Actors}</p>
            </section>
        </div>
    );
};

export default MovieDetails;
