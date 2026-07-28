import React, { useState } from "react";

function SEOOptimizer() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [seoResult, setSeoResult] = useState(null);

  const optimizeSEO = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/seo",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            description,
            category,
          }),
        }
      );

      const data = await response.json();
      setSeoResult(data);

    } catch (error) {
      console.error(error);
      alert("Failed to optimize SEO");
    }
  };


  return (
    <section>

      <h2>
        SEO Optimizer
      </h2>

      <label htmlFor="title">
        Gig Title
      </label>


      <input
        id="title"
        type="text"
        placeholder="Gig Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: "500px" }}
      />

      <p>
        {title.length}/80 characters
      </p>


      <br /><br />

      <label htmlFor="category">
        Category
      </label>


      <input
        id="category"
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e)=>setCategory(e.target.value)}
        style={{ width: "500px" }}
      />


      <br /><br />

      <label htmlFor="description">
        Gig Description
      </label>


      <textarea
        id="description"
        rows="6"
        cols="60"
        placeholder="Gig Description"
        value={description}
        onChange={(e)=>setDescription(e.target.value)}
      />


      <br /><br />


      <button aria-label="Optimize SEO" onClick={optimizeSEO}>
        Optimize SEO
      </button>


      {seoResult && (
        <div>

          <h3>
            Optimized Content
          </h3>


          <p>
            <strong>Title:</strong>{" "}
            {seoResult.optimized_title}
          </p>


          <p>
            <strong>Description:</strong>{" "}
            {seoResult.optimized_description}
          </p>


          {seoResult.tags && (
            <>
              <h4>Tags</h4>

              <ul>
                {seoResult.tags.map((tag,index)=>(
                  <li key={index}>
                    {tag.text}{" "}
                    {tag.valid ? "✅" : "❌"}
                  </li>
                ))}
              </ul>
            </>
          )}


          {seoResult.scores && (
            <>
              <h4>SEO Scores</h4>

              <p>
                Title Score: {seoResult.scores.title}
              </p>

              <p>
                Tag Score: {seoResult.scores.tags}
              </p>

              <p>
                Description Score: {seoResult.scores.description}
              </p>

              <p>
                Overall Score: {seoResult.scores.overall}
              </p>
            </>
          )}


          {seoResult.tips && (
            <>
              <h4>SEO Tips</h4>

              <ul>
                {seoResult.tips.map((tip,index)=>(
                  <li key={index}>
                    {tip}
                  </li>
                ))}
              </ul>
            </>
          )}

        </div>
      )}

    </section>
  );
}

export default SEOOptimizer;
