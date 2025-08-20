import axios from "axios";
import {  render, renderHook, screen, waitFor } from "@testing-library/react";
import getFetchApi from "../../utils/getFetchApi";
import * as ArticleDetail from "../../handles/ArticleDetail";
import { act, lazy } from "react";
import loadArticleComponent from "../../utils/loadArticleComponent";

const { handleDeleteArticle, useFetchArticleDetailData } = ArticleDetail;

jest.mock("axios");

jest.mock("../../utils/loadArticleComponent");

jest.mock("../../utils/getFetchApi");

describe("handleDeleteArticle", () => {
    const mockNavigate = jest.fn();
    beforeEach(() => {
        jest.clearAllMocks();
    })
    test("should delete the article and nav to the url", async () => {
        axios.delete.mockResolvedValue({
            data: {
                url: "/test"
            }
        });
        handleDeleteArticle(1, mockNavigate);
        await waitFor(() => {
            expect(axios.delete).toHaveBeenCalled();    
        })
        expect(mockNavigate).toHaveBeenCalledWith("/test") 
    })
    test("should fail when server error", async () => {
        axios.delete.mockRejectedValue(new Error("Mock error"));
        jest.spyOn(console, "error").mockImplementation(() => {});
        handleDeleteArticle(1, mockNavigate);
        await waitFor(() => {
            expect(axios.delete).toHaveBeenCalled();
        })
        expect(mockNavigate).not.toHaveBeenCalled();
        expect(console.error).toHaveBeenCalledWith("Erreur lors de l'envoi:", "Mock error");
    })
})

describe("useFetchArticleDetailData", () => {
    const mockArticle = { id: 1, title: 'Test', fileName: 'test-article.js' };
    const MockedComponent = () => <div>Mocked Component</div>;
    const mockNavigate = jest.fn();
    beforeEach(() => {
      jest.clearAllMocks();
      getFetchApi.mockResolvedValue(mockArticle);
      jest.spyOn(console, "error").mockImplementation(() => {});
    });
  
    test('fetches article data and loads component', async () => {
      loadArticleComponent.mockResolvedValue({ default: MockedComponent });
  
      const { result } = renderHook(() => useFetchArticleDetailData(1, mockNavigate));
  
      await act(async () => { await Promise.resolve(); });
  
      expect(getFetchApi).toHaveBeenCalledWith('articles/1');
      expect(loadArticleComponent).toHaveBeenCalledWith('test-article.js');
      expect(result.current.article).toEqual(mockArticle);
      expect(result.current.ArticleComponent).toBe(MockedComponent);
    });
  
    test("should fail when loadArticleComponent error", async () => {
      loadArticleComponent.mockRejectedValue(new Error("LoadArticleComponent error"));
  
      const { result } = renderHook(() => useFetchArticleDetailData(1, mockNavigate));
  
      await act(async () => { await Promise.resolve(); });
  
      expect(getFetchApi).toHaveBeenCalledWith('articles/1');
      expect(loadArticleComponent).toHaveBeenCalledWith('test-article.js');
      expect(result.current.article).toEqual(mockArticle);
      expect(console.error).toHaveBeenCalledWith(
        "Erreur lors du chargement du composant:", 
        "LoadArticleComponent error"
      );
      expect(result.current.ArticleComponent).toEqual(null);
    });
    test("should redirect to article on not found article", async () => {
      getFetchApi.mockRejectedValue({
          status: 404,
          statusText: "Not Found",
          data: { message: "Article non trouvé" },
        },
      );
      const { result } = renderHook(() => useFetchArticleDetailData(1, mockNavigate));
      await act(async () => { await Promise.resolve(); });
      expect(getFetchApi).toHaveBeenCalledWith("articles/1");
      expect(loadArticleComponent).not.toHaveBeenCalled();
      expect(result.current.article).toEqual(null);
      expect(result.current.ArticleComponent).toEqual(null);
      expect(mockNavigate).toHaveBeenCalledWith("/article", {"state": {"message": "Article non trouvé"}})
    })
    test("should fail when server error", async () => {
        getFetchApi.mockRejectedValue(new Error("Mock error"));
        const { result } = renderHook(() => useFetchArticleDetailData(1));
  
      await act(async () => { await Promise.resolve(); });
      expect(getFetchApi).toHaveBeenCalledWith("articles/1");
      expect(loadArticleComponent).not.toHaveBeenCalled();
      expect(result.current.article).toEqual(null);
      expect(result.current.ArticleComponent).toEqual(null);
      expect(console.error).toHaveBeenCalledWith("Erreur lors de la recherche:", "Mock error")
    })
  });

  const DummyComponent = () => <div>Article Loaded</div>;

  // Lazy version for Suspense
  const LazyDummyComponent = lazy(() => Promise.resolve({ default: DummyComponent }));
  
  describe('RenderArticleComponent', () => {
    test('renders fallback if no ArticleComponent is provided', () => {
      render(<ArticleDetail.RenderArticleComponent />);
      expect(screen.getByText(/Chargement du contenu/i)).toBeInTheDocument();
    });
  
    test('renders ArticleComponent inside Suspense', async () => {
      render(<ArticleDetail.RenderArticleComponent ArticleComponent={LazyDummyComponent} />);
      
      // Initially fallback should show
      expect(screen.getByText(/Chargement du contenu/i)).toBeInTheDocument();
      
      // Wait for the lazy component to load
      const loadedText = await screen.findByText(/Article Loaded/i);
      expect(loadedText).toBeInTheDocument();
    });
  });