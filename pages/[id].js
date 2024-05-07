import { useRouter } from "next/router";
import RecipeDetails from "@/components/RecipeDetails";
import styled from "styled-components";
import useSWR from "swr";

const BackgroundContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 10vh;
  /* background-image: url("https://unsplash.com/de/fotos/green-vegetable-beside-ceramic-bowl-kXQ3J7_2fpc"); */
  background-color: lightgray;
  background-size: cover;
  z-index: 0;
`;

const BackLink = styled.a`
  position: relative;
  z-index: 1;
  border: solid 2px black;
  margin-top: 20%;
`;

const ContentContainer = styled.div`
  position: relative;
  z-index: 1;
  margin-top: 100px;
`;

export default function RecipeDetailsPage({}) {
  const fetcher = (url) => {
    return fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        throw error; // rethrow the error to propagate it further
      });
  };
  const router = useRouter();
  const { id } = router.query;
  const { data, isLoading, error } = useSWR(`/api/recipes/${id}`, fetcher);

  if (!data) {
    return <div>Oh!Oh! No data available</div>;
  }
  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return <div>Oops! Something went wrong.</div>;
  }

  function handleBackClick(event) {
    event.preventDefault();
    router.back();
  }

  return (
    <>
      <BackgroundContainer>
        <BackLink href="/" onClick={handleBackClick}>
          Back
        </BackLink>
      </BackgroundContainer>
      <ContentContainer>
        <RecipeDetails currentRecipe={data} />
      </ContentContainer>
    </>
  );
}
