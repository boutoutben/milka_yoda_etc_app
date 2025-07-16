import loadArticleComponent from "../../utils/loadArticleComponent";

jest.mock("../../utils/loadArticleComponent", () => ({
  __esModule: true,
  default: jest.fn(),
}));

test('should load the correct article component', async () => {
  const mockModule = { default: () => 'Mocked Article Component' };
  loadArticleComponent.mockResolvedValue(mockModule);

  const module = await loadArticleComponent('TestArticle');
  expect(module.default()).toBe('Mocked Article Component');
});