//paginate util function which takes object as an argument and returns paginated data with metadata
export const paginate = async ({
    model,
    query={},
    page=1,
    limit=10,
    populate="",
    select="",
    sort={ createdAt: -1 }

})=>{
    const sanitizedPage = Math.max(1, Number(page) || 1);
    const sanitizedLimit = Math.max(1, Number(limit)|| 10);
    const skip = (sanitizedPage - 1) * sanitizedLimit;

    const [data, totalItems] = await Promise.all([
        model.find(query)
        .select(select)
        .populate(populate)
        .sort(sort)
        .skip(skip)
        .limit(sanitizedLimit),
        model.countDocuments(query)
    ])

    const totalPages = Math.ceil(totalItems/sanitizedLimit);
    
    return {
        data,
        metadata:{
            totalItems,
            totalPages,
            currentPage:sanitizedPage,
            pageSize:sanitizedLimit,
            hasNextPage:sanitizedPage<totalPages,
            hasPrevPage:sanitizedPage>1
        }
    }
}