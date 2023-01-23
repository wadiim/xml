<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:aw="http://animeweb.com/xml">
    <xsl:output method="xml" encoding="utf-8" doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN"
                doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd" indent="yes"/>

    <xsl:template match="/aw:animeWeb">
        <html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
            <head>
                <title>
                    <xsl:value-of select="name" />
                </title>
                <style type="text/css">
                    h1, h2 {
                        text-align: center;
                    }

                    table {
                        margin-left: auto;
                        margin-right: auto;
                    }

                    table, th, td {
                        padding-left: 8px;
                        text-align: left;
                    }

                    table#animeTable, #animeTable th, #animeTable td {
                        padding: 8px;
                        text-align: center;
                        border: 2px solid black;
                        border-collapse: collapse;
                    }
                </style>
            </head>
            <body>
                <h1>
                    <xsl:value-of select="name" />
                </h1>
                <h2>
                    <xsl:value-of select="concat(author/firstName, ' ', author/lastName)" />
                </h2>
                <table id="animeTable">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Rating</th>
                            <th>Release Date</th>
                            <th>Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        <xsl:for-each select="/aw:animeWeb/animeList/anime">
                            <xsl:sort select="title" />
                            <tr>
                                <td>
                                    <xsl:value-of select="title" />
                                </td>
                                <td>
                                    <xsl:value-of select="rating" />
                                </td>
                                <td>
                                    <xsl:value-of select="releaseDate" />
                                </td>
                                <td>
                                    <xsl:choose>
                                        <xsl:when test="numberOfEpisodes">
                                            <xsl:text>Series</xsl:text>
                                        </xsl:when>
                                        <xsl:otherwise>
                                            <xsl:text>Movie</xsl:text>
                                        </xsl:otherwise>
                                    </xsl:choose>
                                </td>
                            </tr>
                        </xsl:for-each>
                    </tbody>
                </table>
                <h2><em>Summary</em></h2>
                <table id="summary">
                    <tr>
                        <td>Number of anime entries:</td>
                        <td>
                            <xsl:value-of select="count(animeList/anime)" />
                        </td>
                    </tr>
                    <tr>
                        <td>Number of directors:</td>
                        <td>
                            <xsl:value-of select="count(directorList/director)" />
                        </td>
                    </tr>
                    <tr>
                        <td>Number of anime series:</td>
                        <td>
                            <xsl:value-of select="count(animeList/anime/numberOfEpisodes)" />
                        </td>
                    </tr>
                    <tr>
                        <td>Number of anime movies:</td>
                        <td>
                            <xsl:value-of select="count(animeList/anime) - count(animeList/anime/numberOfEpisodes)" />
                        </td>
                    </tr>
                    <tr>
                        <td>Average rating:</td>
                        <td>
                            <xsl:value-of select="sum(animeList/anime/rating) div count(animeList/anime)" />
                        </td>
                    </tr>
                    <tr>
                        <td>Report generation date:</td>
                        <td>
                            <!-- <xsl:value-of select="format-date(current-date(), '[D01]/[M01]/[Y0001]')" /> -->
                            <xsl:text>20/11/2022</xsl:text>
                        </td>
                    </tr>
                </table>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>