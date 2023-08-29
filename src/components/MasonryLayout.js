import { useEffect, useState } from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import "./MasonryLayout.css";

export default function MasonryLayout({
  imageList,
  onDeleteImageSuccess,
  onDeleteImageError,
}) {
  const [hoverStates, setHoverStates] = useState();
  const [deleteAPIInvoked, setDeleteAPIInvoked] = useState(false);
  useEffect(() => {
    let _hoverStates = {};
    for (const image of imageList) {
      _hoverStates[image._id] = false;
    }
    setHoverStates(_hoverStates);
  }, [imageList]);

  const handleDeleteImage = async function (id) {
    const url = `https://${process.env.REACT_APP_DOMAIN_URL}/api/v1/images/${id}`;
    setDeleteAPIInvoked(true);
    try {
      const response = await fetch(url, {
        method: "DELETE",
        mode: "cors",
      });
      console.log(response);
      onDeleteImageSuccess();
    } catch (error) {
      console.error(error);
      onDeleteImageError();
    }
  };

  return (
    <div className="masonry-container">
      <ResponsiveMasonry
        columnsCountBreakPoints={{ 200: 1, 450: 2, 650: 3, 850: 4 }}
      >
        <Masonry gutter="20px">
          {imageList.map((item) => (
            <div
              className="masonry-item"
              key={item._id}
              onMouseEnter={() =>
                setHoverStates({ ...hoverStates, [item._id]: true })
              }
              onMouseLeave={() =>
                setHoverStates({ ...hoverStates, [item._id]: false })
              }
            >
              {hoverStates[item._id] ? (
                <div className="masonry-item-overlay">
                  <div>
                    <button
                      type="button"
                      className="masonry-item-delete-btn"
                      onClick={() => handleDeleteImage(item._id)}
                    >
                      delete
                    </button>
                  </div>
                  <div className="masonry-item-name">{item.originalName}</div>
                </div>
              ) : null}
              <img
                className="masonry-image"
                src={`https://${process.env.REACT_APP_DOMAIN_URL}${item.path}`}
                alt={item.originalName}
              ></img>
            </div>
          ))}
        </Masonry>
      </ResponsiveMasonry>
    </div>
  );
}
