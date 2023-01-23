<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:aw="http://animeweb.com/xml">
    <xsl:output method="text" encoding="utf-8" indent="yes" />

    <xsl:key name="director" match="/aw:animeWeb/directorList/director" use="@directorId" />

    <xsl:template match="/aw:animeWeb">
        <xsl:element name="header">
            <xsl:value-of select="concat(
                'Author: ', author/firstName, ' ', author/lastName, '&#xA;',
                'Report title: ', name
            )" />
        </xsl:element>
        <xsl:text>&#xA;&#xA;</xsl:text>
        <xsl:element name="animeList">
            <xsl:variable name="spaces">
                <xsl:text>                                                                                   </xsl:text>
            </xsl:variable>
            <xsl:for-each select="animeList/anime">
                <xsl:value-of select="concat(
                    substring(concat(title, $spaces), 1, 26),
                    substring(concat(rating, $spaces), 1, 6),
                    substring(concat(releaseDate, $spaces), 1, 14)
                )" />
                <xsl:choose>
                    <xsl:when test="numberOfEpisodes">
                        <xsl:text>Series </xsl:text>
                    </xsl:when>
                    <xsl:otherwise>
                        <xsl:text>Movie  </xsl:text>
                    </xsl:otherwise>
                </xsl:choose>
                <xsl:for-each select="genreList/genre">
                    <xsl:value-of select="@genreId" />
                    <xsl:choose>
                        <xsl:when test="position() != last()">
                            <xsl:text>, </xsl:text>
                        </xsl:when>
                    </xsl:choose>
                </xsl:for-each>
                <xsl:text>&#xA;</xsl:text>
                <xsl:value-of select="substring($spaces, 1, 46)" />
                <xsl:for-each select="creatorList/creator">
                    <xsl:for-each select="key('director', @directorId)">
                        <xsl:value-of select="concat(firstName, ' ', lastName)" />
                    </xsl:for-each>
                    <xsl:choose>
                        <xsl:when test="position() != last()">
                            <xsl:text>, </xsl:text>
                        </xsl:when>
                    </xsl:choose>
                </xsl:for-each>
                <xsl:text>&#xA;</xsl:text>
            </xsl:for-each>
        </xsl:element>
        <xsl:text>&#xA;</xsl:text>
        <xsl:element name="summary">
            <xsl:value-of select="concat(
                'Number of anime entries: ', count(animeList/anime), '&#xA;',
                'Number of directors: ', count(directorList/director), '&#xA;',
                'Number of anime series: ', count(animeList/anime/numberOfEpisodes), '&#xA;',
                'Number of anime movies: ', count(animeList/anime) - count(animeList/anime/numberOfEpisodes), '&#xA;',
                'Average rating: ', sum(animeList/anime/rating) div count(animeList/anime), '&#xA;',
                'Report generation date: ', '19/11/2022', '&#xA;'
            )" />
        </xsl:element>
    </xsl:template>
</xsl:stylesheet>