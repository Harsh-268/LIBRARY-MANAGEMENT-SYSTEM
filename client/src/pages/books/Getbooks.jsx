import React, { useEffect, useState } from "react";
import api from "../../api/axios.js";
import BookCard from "../../components/cards/Bookcards.jsx";

const Getbooks = () => {
  const [books, setBooks] = useState([]);
  const [failed,setFailed]=useState(false)

  useEffect(() => {
    const getBooks = async () => {
      try {
        const response = await api.get("/books/all-books", {});

        const bookStats = response.data.data.books.map((book) => ({
          _id:book._id,
          title: book.title,
          description: book.description,
          authors: book.authors,
          thumbnail: book.thumbnail,
          category: book.category,
        } ));
        setBooks(bookStats)
      
        
        
      } catch (error) {
        console.error("Unable to get books,",error)
        setFailed(true)
      }
      
    };
    getBooks()
    
        
  }, []);

  return (
    <div className="">
     {failed?(
        <div>Unable to get books</div>
     ):(books.length>0?(
        books.map((singleBook)=>(
            <BookCard key={singleBook._id} book={singleBook}/>
        ))
     ):(<div>Loading</div>)
      
     )}
    </div>
  );
};

export default Getbooks;
