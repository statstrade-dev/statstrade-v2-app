import * as contract from '@statstrade/feature/newsroom/handoff-contract.js'

import React from 'react'

// statstrade-web.feature.newsroom.article/Article [7] 
export function Article({article}){
  let blocks = contract.markdownBlocks(article["markdown"]);
  return (
    <article
      className="st-editorial-article"
      style={{
          "maxWidth":780,
          "margin":"24px auto",
          "padding":24,
          "lineHeight":1.7
        }}>
      <h1>{article["headline"]}</h1>
      <p>{article["standfirst"]}</p>
      <p><small>{article["organization"] || "StatsTrade"}</small></p>
      {blocks.map(function (block,index){
        return React.createElement(
          (block["kind"] == "heading") ? ("h" + Math.min(6,1 + block["level"])) : "p",
          {"key":index,"style":{"whiteSpace":"pre-wrap"}},
          block["text"]
        );
      })}
      <h2>Sources</h2>
      <ol>
        {article["sources"].map(function (source){
          let url = contract.safeUrl(source["url"]);
          return (
            <li key={source["id"]}>
              {url ? (
                <a href={url} rel="noopener noreferrer">{source["title"]}</a>) : (
                <span>{source["title"]}</span>)}
               — 
              {source["publisher"]}
            </li>);
        })}
      </ol>
    </article>);
}