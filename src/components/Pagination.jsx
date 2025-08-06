import React, { useState, useEffect } from 'react';
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
const Pagination = ({ totalRecords, currentPage, pageSize, totalPages, onPaginationChange }) => {
  const pageSetSize = 5;
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(Math.min(pageSetSize, totalPages));
  const [current, setCurrent] = useState(currentPage);
  const [currentPageSize, setCurrentPageSize] = useState(pageSize);

  useEffect(() => {
    const modTotalRecordsPageSize = totalRecords % pageSize === 0 ? pageSize : totalRecords % pageSize;
    setCurrentPageSize(current === totalPages ? modTotalRecordsPageSize : pageSize);
  }, [current, totalPages, pageSize, totalRecords]);

  const changePage = async (page) => {
    if (current !== page) {
      setCurrent(page);
      await loadData(page, currentPageSize);
    }
  };

  const changePageSize = async (size) => {
    if (currentPageSize !== size) {
      setCurrentPageSize(size);
      setCurrent(1);
      setStartPage(1);
      await loadData(1, size);
      setEndPage(Math.min(pageSetSize, totalPages));
    }
  };

  const previousPage = async () => {
    if (current > 1) {
      const newPage = current - 1;
      if (newPage < startPage) {
        await showPreviousPageSet();
      } else {
        setCurrent(newPage);
        await loadData(newPage, currentPageSize);
      }
    }
  };

  const nextPage = async () => {
    if (current < totalPages) {
      const newPage = current + 1;
      if (newPage > endPage) {
        await showNextPageSet();
      }
      setCurrent(newPage);
      await loadData(newPage, currentPageSize);
    }
  };

  const showNextPageSet = async () => {
    if (endPage < totalPages) {
      const newStartPage = endPage + 1;
      setStartPage(newStartPage);
      setEndPage(Math.min(totalPages, newStartPage + (pageSetSize - 1)));
      setCurrent(newStartPage);
      await loadData(newStartPage, currentPageSize);
    }
  };

  const showPreviousPageSet = async () => {
    if (startPage > 1) {
      const newEndPage = startPage - 1;
      setEndPage(newEndPage);
      setStartPage(Math.max(1, newEndPage - (pageSetSize - 1)));
      setCurrent(newEndPage);
      await loadData(newEndPage, currentPageSize);
    }
  };

  const goToFirstPage = async () => {
    setCurrent(1);
    setStartPage(1);
    setEndPage(Math.min(pageSetSize, totalPages));
    await loadData(1, currentPageSize);
  };

  const goToLastPage = async () => {
    setCurrent(totalPages);
    setEndPage(totalPages);
    setStartPage(Math.max(1, totalPages - (totalPages % pageSetSize) + 1));
    await loadData(totalPages, currentPageSize);
  };

  const loadData = async (page, size) => {
    const paginationData = { currentPage: page, pageSize: size, totalPages, totalRecords };
    onPaginationChange(paginationData);
  };

  return (
    <div className='relative z-[1000]'>
      <div className="flex items-center flex-wrap gap-2 justify-between text-sm text-gray-600 dark:text-white">
        <div className="flex items-center">
          <span className="small text-grey-600">Showing</span>
          <div className="relative">
            <button className="btn btn-outline p-2 dropdown-toggle text-start" type="button" id="contentNo">
              {currentPageSize}
            </button>
            {/* <ul className="absolute" aria-labelledby="contentNo">
            <li><button className="dropdown-item" onClick={() => changePageSize(10)}>10</button></li>
            <li><button className="dropdown-item" onClick={() => changePageSize(20)}>20</button></li>
            <li><button className="dropdown-item" onClick={() => changePageSize(50)}>50</button></li>
          </ul> */}
          </div>
          <span className="me-3 small text-grey-600">of {totalRecords} records</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="arrows flex items-center justify-between">
            <button type="button" title="Previous" onClick={previousPage} className='hover:text-blue-600 text-lg'>
              <IoIosArrowBack />
            </button>
          </div>

          <ul className="pagination mb-0 bg-aliceBlue flex">
            {totalPages > 1 && (
              <>
                {current > pageSetSize && (
                  <>
                    <li className="num">
                      <button className="px-2 py-0.5 hover:text-blue-600" onClick={goToFirstPage}>1</button>
                    </li>
                    {current >= pageSetSize + 1 && (
                      <li className="num">
                        <button className="px-2 py-0.5 hover:text-blue-600" onClick={showPreviousPageSet}>...</button>
                      </li>
                    )}
                  </>
                )}

                {Array.from({ length: Math.min(endPage, totalPages) - startPage + 1 }, (_, i) => (
                  <li key={i} className={`num ${startPage + i === current ? 'bg-blue-200 dark:bg-blue-600 rounded-xl' : ''}`}>
                    <button className="px-2 py-0.5 hover:text-blue-400" onClick={() => changePage(startPage + i)}>{startPage + i}</button>
                  </li>
                ))}

                {(current < totalPages - (pageSetSize - 1)) && (
                  <>
                    <li className="num">
                      <button className="px-2 py-0.5 hover:text-blue-600" onClick={showNextPageSet}>...</button>
                    </li>
                    <li className="num">
                      <button className="px-2 py-0.5 hover:text-blue-600" onClick={goToLastPage}>{totalPages}</button>
                    </li>
                  </>
                )}
              </>
            )}

            {totalPages === 1 && (
              <li className="num">
                <button className="px-2 py-0.5 hover:text-blue-200 bg-blue-200 dark:bg-blue-600 rounded-xl" onClick={() => changePage(1)}>1</button>
              </li>
            )}
          </ul>

          <div className="flex items-center justify-between">
            <button type="button" title="Next" onClick={nextPage} className='hover:text-blue-600 text-lg'>
              <IoIosArrowForward />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
