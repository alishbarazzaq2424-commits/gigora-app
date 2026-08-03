import React, { useState } from "react";

function SEOOptimizer() {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [seoResult, setSeoResult] = useState(null);


  const optimizeSEO = () => {

    setSeoResult({
      title: title,
      description: description,
      category: category
    });

  };


  return (
    <section>

      <h2>
        SEO Optimizer
        <span title="Optimize your gig title, description and tags for better rankings">
          ❓
        </span>
      </h2>


      <label>
        Gig Title
      </label>


      <input
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


      <label>
        Category
      </label>


      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        style={{ width: "500px" }}
      />


      <br /><br />


      <label>
        Gig Description
      </label>


      <textarea

        rows="6"
        cols="60"
        placeholder="Gig Description"

        value={description}

        onChange={(e) => setDescription(e.target.value)}

      />


      <br /><br />


      <button onClick={optimizeSEO}>
        Optimize SEO
      </button>



      {seoResult && (

        <div>

          <h3>
            Optimized Content
          </h3>


          <p>
            <strong>Title:</strong>{" "}
            {seoResult.title}
          </p>


          <p>
            <strong>Description:</strong>{" "}
            {seoResult.description}
          </p>


          <p>
            <strong>Category:</strong>{" "}
            {seoResult.category}
          </p>


        </div>

      )}


    </section>
  );
}


export default SEOOptimizer;
