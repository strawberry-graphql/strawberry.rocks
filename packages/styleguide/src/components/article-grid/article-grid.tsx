import { Article, ArticleCard } from "../article-card/article-card";

export const ArticleGrid = ({ articles }: { articles: Article[] }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
      {articles.map((article) => (
        <ArticleCard key={article.href} {...article} />
      ))}
    </div>
  );
};
